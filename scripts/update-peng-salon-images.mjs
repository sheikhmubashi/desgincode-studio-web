import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { createClient } from "next-sanity";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
 throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.");
}

if (!token) {
 throw new Error("Set SANITY_API_TOKEN to a Sanity token with dataset write access.");
}

const photos = [
 {
  filename: "peng-salon-reference-1.jpg",
  imageUrl:
   "https://images.unsplash.com/photo-1746723378067-83a345ff3160?fm=jpg&q=80&w=1400&auto=format&fit=crop",
  sourceUrl:
   "https://unsplash.com/photos/a-hair-salon-interior-with-hair-products-and-clients-5xFEY6ZEE8g",
 },
 {
  filename: "peng-salon-reference-2.jpg",
  imageUrl:
   "https://images.unsplash.com/photo-1706629503720-13cad35ce2e5?fm=jpg&q=80&w=1400&auto=format&fit=crop",
  sourceUrl:
   "https://unsplash.com/photos/a-hair-salon-with-chairs-and-mirrors-DUvovc88OfE",
 },
 {
  filename: "peng-salon-reference-3.jpg",
  imageUrl:
   "https://images.unsplash.com/photo-1781450090585-1a511b7066d9?fm=jpg&q=80&w=1400&auto=format&fit=crop",
  sourceUrl:
   "https://unsplash.com/photos/a-modern-hair-salon-interior-with-stylish-chairs-and-mirrors-_Fy7Kq0w6OI",
 },
 {
  filename: "peng-salon-reference-4.jpg",
  imageUrl:
   "https://images.unsplash.com/photo-1703792686930-9efa64a9c6c5?fm=jpg&q=80&w=1400&auto=format&fit=crop",
  sourceUrl:
   "https://unsplash.com/photos/a-hair-salon-with-chairs-and-mirrors-and-lights-SUBpTBqFc6c",
 },
];

const client = createClient({
 projectId,
 dataset,
 apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
 token,
 useCdn: false,
});

const document = await client.fetch(
 '*[_id == "interiorsPage" && _type == "interiorsPage"][0]{_id,_rev,projects}',
);

if (!document) {
 throw new Error('Sanity document "interiorsPage" was not found; no changes were made.');
}

const matchingProjects = (document.projects ?? [])
 .map((project, index) => ({ project, index }))
 .filter(({ project }) => project.title?.trim().toLowerCase() === "peng's salon");

if (matchingProjects.length !== 1) {
 throw new Error(
  `Expected exactly one Peng's Salon project, found ${matchingProjects.length}; no changes were made.`,
 );
}

const images = [];

for (const photo of photos) {
 const existingAssetId = await client.fetch(
  '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
  { filename: photo.filename },
 );

 let assetId = existingAssetId;

 if (!assetId) {
  const response = await fetch(photo.imageUrl);
  if (!response.ok) {
   throw new Error(`Failed to download ${photo.sourceUrl}: HTTP ${response.status}.`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
   throw new Error(`Expected an image from ${photo.sourceUrl}; received ${contentType ?? "no content type"}.`);
  }

  const asset = await client.assets.upload(
   "image",
   Buffer.from(await response.arrayBuffer()),
   { filename: photo.filename, contentType: "image/jpeg" },
  );
  assetId = asset._id;
 }

 images.push({
  _key: randomBytes(6).toString("hex"),
  _type: "image",
  alt: "Temporary salon interior reference photo; not an image of Peng's Salon.",
  asset: { _type: "reference", _ref: assetId },
 });
}

const { project, index } = matchingProjects[0];
const { externalEmbeds: _externalEmbeds, ...preservedProject } = project;
const nextProjects = [...document.projects];
nextProjects[index] = {
 ...preservedProject,
 description:
  "Temporary salon reference photos from Unsplash; these are not photographs of Peng's Salon.",
 images,
};

const updated = await client
 .patch(document._id)
 .ifRevisionId(document._rev)
 .set({ projects: nextProjects })
 .commit();

console.log(`Updated ${updated._id}; Peng's Salon now has ${images.length} reference images.`);
for (const photo of photos) {
 console.log(`${photo.filename}: ${photo.sourceUrl}`);
}
console.log("License: https://unsplash.com/license");
