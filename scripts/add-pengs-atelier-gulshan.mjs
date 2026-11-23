import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
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

const assetsRoot = path.resolve(
 process.env.CLIENT_ASSETS_DIR ?? path.join(os.homedir(), "Downloads"),
);
const sourceDir = path.join(assetsRoot, "peng's gulshan");
const title = "PENG'S ATELIER - GULSHAN";
const category = "Hospitality";
const location = "Gulshan";
const mainFilename = "WhatsApp-image-main.jpeg";

const client = createClient({
 projectId,
 dataset,
 apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
 token,
 useCdn: false,
});

// Newer API versions hide draft documents by default; keep Studio's draft in sync.
const draftClient = client.withConfig({ apiVersion: "2024-01-01" });

const filenames = (await readdir(sourceDir))
 .filter((name) => /\.jpe?g$/i.test(name))
 .sort((a, b) => {
  if (a === mainFilename) return -1;
  if (b === mainFilename) return 1;
  return a.localeCompare(b);
 });

if (filenames.length === 0) {
 throw new Error(`No JPEG images found in ${sourceDir}.`);
}

if (!filenames.includes(mainFilename)) {
 throw new Error(`Expected ${mainFilename} in ${sourceDir}; no changes were made.`);
}

const assetRefs = [];

for (const filename of filenames) {
 const assetFilename =
  filename === mainFilename
   ? "pengs-atelier-gulshan--main.jpeg"
   : `pengs-atelier-gulshan--${filename}`;
 const existingAssetId = await client.fetch(
  '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
  { filename: assetFilename },
 );

 const assetId =
  existingAssetId ??
  (
   await client.assets.upload("image", readFileSync(path.join(sourceDir, filename)), {
    filename: assetFilename,
    contentType: "image/jpeg",
   })
  )._id;

 assetRefs.push(assetId);
}

for (const documentId of ["interiorsPage", "drafts.interiorsPage"]) {
 const targetClient = documentId.startsWith("drafts.") ? draftClient : client;
 const doc = await targetClient.fetch(
  '*[_id == $id][0]{_id,_rev,projects}',
  { id: documentId },
 );
 if (!doc) {
  console.log(`Skipping ${documentId}: document not present.`);
  continue;
 }

 const matches = (doc.projects ?? [])
  .map((entry, index) => ({ entry, index }))
  .filter(({ entry }) => entry.title?.trim().toLowerCase() === title.toLowerCase());

 if (matches.length > 1) {
  throw new Error(`Multiple projects titled "${title}" in ${documentId}; no changes made.`);
 }

 const nextProjects = [...(doc.projects ?? [])];

 if (matches[0]) {
  const { entry, index } = matches[0];
  const images = [...(entry.images ?? [])];
  const existingRefs = new Set(images.map((image) => image?.asset?._ref).filter(Boolean));
  let added = 0;
  for (const assetId of assetRefs) {
   if (existingRefs.has(assetId)) continue;
   images.push({
    _key: randomBytes(6).toString("hex"),
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
   });
   existingRefs.add(assetId);
   added++;
  }
  nextProjects[index] = { ...entry, title, category, location, images };
  if (added === 0) {
   console.log(`${documentId}: "${title}" already has all ${assetRefs.length} image(s).`);
   continue;
  }
  console.log(`${documentId}: added ${added} image(s) to existing "${title}".`);
 } else {
  nextProjects.push({
   _key: randomBytes(6).toString("hex"),
   _type: "project",
   title,
   category,
   location,
   images: assetRefs.map((assetId) => ({
    _key: randomBytes(6).toString("hex"),
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
   })),
  });
  console.log(`${documentId}: created "${title}" with ${assetRefs.length} image(s).`);
 }

 await targetClient.patch(doc._id).ifRevisionId(doc._rev).set({ projects: nextProjects }).commit();
}
