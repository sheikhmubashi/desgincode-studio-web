import { randomBytes } from "node:crypto";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { createClient } from "next-sanity";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const assetsRoot = path.resolve(
 process.env.CLIENT_ASSETS_DIR ??
  path.join(os.homedir(), "Desktop", "Design code docs"),
);
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
 throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.");
}

if (!token) {
 throw new Error("Set SANITY_API_TOKEN to a Sanity token with dataset write access.");
}

const projects = [
 {
  title: "NK Residence Interiors",
  category: "Residence Interiors",
  location: "Karachi – 1000 sq yard private residence",
  files: [
   ["NK RESIDENCE", "HM1_5001.jpg"],
   ["NK RESIDENCE", "HM1_5003.jpg"],
   ["NK RESIDENCE", "HM1_5013.jpg"],
   ["NK RESIDENCE", "HM1_5038.jpg"],
   ["NK RESIDENCE", "HM1_5169.jpg"],
   ["NK RESIDENCE", "HM1_5179.jpg"],
   ["NK RESIDENCE", "HM1_5181.jpg"],
   ["NK RESIDENCE", "HM1_5191.jpg"],
   ["NK RESIDENCE", "HM1_5273.jpg"],
  ],
 },
 {
  title: "AB Interior",
  category: "Residence Interiors",
  location: "Emaar, Karachi – 4 Bedroom Apartment",
  files: [
   ["projectphotos2commercialinteriors\\MTU OFFICE", "Director 1 View 1.jpg"],
   ["projectphotos2commercialinteriors\\MTU OFFICE", "Director 1 view 2.jpg"],
   ["projectphotos2commercialinteriors\\MTU OFFICE", "Confrence Room.jpg"],
   ["projectphotos2commercialinteriors\\MTU OFFICE", "RECEPTION.jpg"],
  ],
 },
 {
  title: "KI Interior",
  category: "Residence Interiors",
  location: "Emaar, Karachi – 4 Bedroom Apartment",
  files: [
   ["KI Interiors", "LIVING ROOM - VIEW 01.jpg"],
   ["KI Interiors", "Living Room 02.jpg"],
   ["KI Interiors", "Living Room 03(Updated).jpg"],
   ["KI Interiors", "Living Room 04.jpg"],
   ["KI Interiors", "Living Room 05.jpg"],
   ["KI Interiors", "Living Room 06 Updated.jpg"],
  ],
 },
 {
  title: "Kasimali Residence",
  category: "Residence Interiors",
  location: "Karachi – 666 sq yard private residence",
  files: [[".", "77001286_1356943504430008_6723283213214547968_n.jpg.jpeg"]],
 },
 {
  title: "FK Interior",
  category: "Residence Interiors",
  location: "Emaar, Karachi – 4 Bedroom Apartment",
  files: [[".", "20220201_172239.jpg.jpeg"]],
 },
 {
  title: "QG Head Office",
  category: "Commercial Interiors",
  location: "QG Head Office",
  replaceImages: true,
  files: [
   ["QG Head Office\\QG Head Office", "1.jpg"],
   ["QG Head Office\\QG Head Office", "10.jpg"],
   ["QG Head Office\\QG Head Office", "11.jpg"],
   ["QG Head Office\\QG Head Office", "12.jpg"],
   ["QG Head Office\\QG Head Office", "3.jpg"],
   ["QG Head Office\\QG Head Office", "2nd Floor  (3).jpg"],
  ],
 },
 {
  title: "Peng's Salon",
  category: "Salons",
  location: "DHA Phase 01 – Karachi",
  files: [],
 },
];

const client = createClient({
 projectId,
 dataset,
 apiVersion,
 token,
 useCdn: false,
});

const document = await client.fetch(
 '*[_id == "interiorsPage" && _type == "interiorsPage"][0]{_id,_rev,projects}',
);

if (!document) {
 throw new Error('Sanity document "interiorsPage" was not found; no changes were made.');
}

const nextProjects = [...(document.projects ?? [])];
const matchesByTitle = new Map();

for (const project of projects) {
 const matches = nextProjects
  .map((entry, index) => ({ entry, index }))
  .filter(
   ({ entry }) =>
    entry.title?.trim().toLowerCase() === project.title.toLowerCase(),
  );

 if (matches.length > 1) {
  throw new Error(`Multiple existing projects match "${project.title}"; refusing to update.`);
 }

 matchesByTitle.set(project.title, matches[0]);
}

const sourceFiles = projects.flatMap((project) =>
 project.files.map(([folder, filename]) => ({
  project,
  filename,
  path: path.join(assetsRoot, folder, filename),
 })),
);

for (const file of sourceFiles) {
 await access(file.path);
}

const slugify = (value) =>
 value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const assetRefs = new Map();

for (const file of sourceFiles) {
 const assetFilename = `${slugify(file.project.title)}--${file.filename}`;
 const existingAssetId = await client.fetch(
  '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
  { filename: assetFilename },
 );

 const assetId =
  existingAssetId ??
  (
   await client.assets.upload("image", createReadStream(file.path), {
    filename: assetFilename,
    contentType: "image/jpeg",
   })
  )._id;

 assetRefs.set(`${file.project.title}\0${file.filename}`, assetId);
}

for (const project of projects) {
 const match = matchesByTitle.get(project.title);
 const existing = match?.entry;
 const next = {
  ...(existing ?? {}),
  _key: existing?._key ?? randomBytes(6).toString("hex"),
  _type: existing?._type ?? "project",
  title: project.title,
  category: project.category,
  location: project.location,
 };
 const images = project.replaceImages ? [] : [...(existing?.images ?? [])];
 const existingAssetIds = new Set(
  images.map((image) => image?.asset?._ref).filter(Boolean),
 );

 for (const [folder, filename] of project.files) {
  const assetId = assetRefs.get(`${project.title}\0${filename}`);
  if (!assetId || existingAssetIds.has(assetId)) continue;

  images.push({
   _key: randomBytes(6).toString("hex"),
   _type: "image",
   asset: { _type: "reference", _ref: assetId },
  });
  existingAssetIds.add(assetId);
 }

 if (images.length > 0 || existing?.images) {
  next.images = images;
 }

 if (!match) {
  nextProjects.push(next);
 } else {
  nextProjects[match.index] = next;
 }
}

const updated = await client
 .patch(document._id)
 .ifRevisionId(document._rev)
 .set({ projects: nextProjects })
 .commit();

console.log(`Updated ${updated._id}; project count: ${nextProjects.length}.`);
for (const project of projects) {
 const entry = nextProjects.find(
  (candidate) =>
   candidate.title?.trim().toLowerCase() === project.title.toLowerCase(),
 );
 console.log(`${project.title}: ${entry?.images?.length ?? 0} image(s)`);
}
