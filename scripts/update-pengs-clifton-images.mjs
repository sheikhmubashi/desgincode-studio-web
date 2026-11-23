import { randomBytes } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { createClient } from "next-sanity";
import sharp from "sharp";

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
const sourceDir = path.join(assetsRoot, "pengssalons", "PENGS CLIFTON", "PENGS CLIFTON");
const projectTitle = "PENG'S SALON";

const client = createClient({
 projectId,
 dataset,
 apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
 token,
 useCdn: false,
});

// Newer API versions hide draft documents by default; use the raw perspective
// so Studio's unpublished copy stays in sync with the published page.
const draftClient = client.withConfig({ apiVersion: "2024-01-01" });

const filenames = (await readdir(sourceDir)).filter((name) => /\.jpe?g$/i.test(name)).sort();
if (filenames.length === 0) {
 throw new Error(`No Clifton JPEGs found in ${sourceDir}.`);
}

const assetRefs = [];

for (const filename of filenames) {
 const assetFilename = `pengs-clifton--${filename.replace(/\.jpe?g$/i, ".jpg")}`;
 const existingAssetId = await client.fetch(
  '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
  { filename: assetFilename },
 );

 let assetId = existingAssetId;
 if (!assetId) {
  // The originals are valid JPEGs but use an SOS encoding libvips rejects.
  // Re-encode them so Sanity can generate derivatives reliably.
  const original = await readFile(path.join(sourceDir, filename));
  const reencoded = await sharp(original, { failOn: "none" })
   .jpeg({ quality: 85 })
   .toBuffer();
  assetId = (
   await client.assets.upload("image", reencoded, {
    filename: assetFilename,
    contentType: "image/jpeg",
   })
  )._id;
 }
 assetRefs.push(assetId);
}

const documentIds = ["interiorsPage", "drafts.interiorsPage"];
for (const documentId of documentIds) {
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
  console.log(`${documentId}: "${projectTitle}" already has all ${assetRefs.length} Clifton image(s).`);
  continue;
 }

 const nextProjects = [...doc.projects];
 nextProjects[index] = { ...entry, images };
 await targetClient.patch(doc._id).ifRevisionId(doc._rev).set({ projects: nextProjects }).commit();
 console.log(`${documentId}: added ${added} image(s) to "${projectTitle}" (now ${images.length}).`);
}
