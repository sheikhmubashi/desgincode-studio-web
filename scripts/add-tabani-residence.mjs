import { randomBytes } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
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

const outerDir = path.join(
 os.homedir(),
 "Downloads",
 "WhatsApp Unknown 2026-11-23 at 3.58.22 PM",
);
const sourceDir = path.join(outerDir, path.basename(outerDir));

const client = createClient({
 projectId,
 dataset,
 apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
 token,
 useCdn: false,
});

const filenames = readdirSync(sourceDir)
 .filter((name) => /\.(jpe?g|png)$/i.test(name))
 .sort((a, b) => a.localeCompare(b));

if (filenames.length === 0) {
 throw new Error(`No images found in ${sourceDir}.`);
}

console.log(`Source: ${sourceDir} (${filenames.length} images)`);

const assetRefs = [];

for (const filename of filenames) {
 // Reuse either a previously prefixed upload or an unattached asset with the
 // same original filename from the earlier (reverted) attempt.
 const existingAssetId = await client.fetch(
  '*[_type == "sanity.imageAsset" && originalFilename in [$prefixed,$plain]][0]._id',
  { prefixed: `tabani-residence--${filename}`, plain: filename },
 );

 if (existingAssetId) {
  assetRefs.push(existingAssetId);
  continue;
 }

 let bytes = readFileSync(path.join(sourceDir, filename));
 let assetId;
 try {
  assetId = (await client.assets.upload("image", bytes, {
   filename: `tabani-residence--${filename}`,
   contentType: "image/jpeg",
  }))._id;
 } catch (error) {
  console.log(`  re-encoding ${filename} (${error.message})`);
  bytes = await sharp(bytes, { failOn: "none" }).jpeg({ quality: 92 }).toBuffer();
  assetId = (await client.assets.upload("image", bytes, {
   filename: `tabani-residence--${filename}`,
   contentType: "image/jpeg",
  }))._id;
 }
 assetRefs.push(assetId);
}

for (const documentId of ["architecturePage", "drafts.architecturePage"]) {
 const doc = await client.fetch(
  '*[_id == $id][0]{_id,_rev,projects}',
  { id: documentId },
 );
 if (!doc) {
  console.log(`Skipping ${documentId}: document not present.`);
  continue;
 }

 const matches = (doc.projects ?? [])
  .map((entry, index) => ({ entry, index }))
  .filter(({ entry }) => entry.title?.trim().toLowerCase() === "residences");

 if (matches.length !== 1) {
  throw new Error(`Expected one RESIDENCES project in ${documentId}, found ${matches.length}; no changes made.`);
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
  console.log(`${documentId}: RESIDENCES already has all ${assetRefs.length} image(s) (${images.length} total).`);
  continue;
 }

 const nextProjects = [...doc.projects];
 nextProjects[index] = { ...entry, images };
 await client.patch(doc._id).ifRevisionId(doc._rev).set({ projects: nextProjects }).commit();
 console.log(`${documentId}: added ${added} image(s) to RESIDENCES (now ${images.length}).`);
}
