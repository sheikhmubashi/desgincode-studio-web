import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
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
 process.env.CLIENT_ASSETS_DIR ?? path.join(os.homedir(), "Downloads", "Compressed", "Compressed"),
);
const sourceDir = path.join(assetsRoot, "pengssalons");
const filenames = [
 "RECEPTION VIEW.jpeg",
 "VIEW 01.jpg",
 "VIEW 02.jpg",
 "02 RECEPTION AREA - WOMEN Peng's Francshise KDA.jpg",
];
const projectTitle = "PENG'S SALON - DHA PHASE 01";

const client = createClient({
 projectId,
 dataset,
 apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
 token,
 useCdn: false,
});

// Newer API versions hide draft documents by default; keep Studio's draft in sync.
const draftClient = client.withConfig({ apiVersion: "2024-01-01" });

const assetRefs = [];

for (const filename of filenames) {
 const assetFilename = `pengs-dha-phase-01--${filename.replace(/\.(jpe?g)$/i, ".$1")}`;
 const existingAssetId = await client.fetch(
  '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
  { filename: assetFilename },
 );

 const assetId =
  existingAssetId ??
  (
   await client.assets.upload(
    "image",
    readFileSync(path.join(sourceDir, filename)),
    { filename: assetFilename, contentType: "image/jpeg" },
   )
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
  .filter(({ entry }) => entry.title?.trim().toLowerCase() === projectTitle.toLowerCase());

 if (matches.length !== 1) {
  throw new Error(`Expected one "${projectTitle}" project in ${documentId}, found ${matches.length}; no changes made.`);
 }

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

 if (added === 0) {
  console.log(`${documentId}: "${projectTitle}" already has all ${assetRefs.length} extra image(s).`);
  continue;
 }

 const nextProjects = [...doc.projects];
 nextProjects[index] = { ...entry, images };
 await targetClient.patch(doc._id).ifRevisionId(doc._rev).set({ projects: nextProjects }).commit();
 console.log(`${documentId}: added ${added} image(s) to "${projectTitle}" (now ${images.length}).`);
}
