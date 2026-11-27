/**
 * update-residences-sections.mjs
 *
 * Uploads images for 4 client residence projects and organises them as
 * named sub-sections inside the RESIDENCES project on the architecturePage
 * Sanity document.
 *
 * Sections created / updated:
 *   • AJ RESIDENCE  – 30+ renders from AJ RESIDENCE\AJ RESIDENCE\
 *   • SA RESIDENCE  – 21 renders from SA RESIDENCE\SA RESIDENCE\
 *   • OS RESIDENCE  – 2 renders from residences\OS RESIDENCE\OS RESIDENCE\
 *   • E3 RESIDENCE  – 3 renders from residences\E3 (*.jpg)
 *
 * Usage (requires SANITY_API_TOKEN in .env.local):
 *   node --env-file=.env.local scripts/update-residences-sections.mjs
 *
 * Safe to re-run: images already in Sanity are reused; sections already
 * containing all images are left untouched.
 */

import { randomBytes } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
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
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.",
  );
}
if (!token) {
  throw new Error("Set SANITY_API_TOKEN to a Sanity token with dataset write access.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
  token,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Define source directories and metadata for each sub-section
// ---------------------------------------------------------------------------
const BASE = path.join(process.env.USERPROFILE ?? process.env.HOME, "Downloads", "Downloads", "Downloads");

const SECTIONS = [
  {
    sectionTitle: "AJ RESIDENCE",
    description:
      "AJ Residence is a bespoke family home that blends contemporary architecture with thoughtful spatial planning. The design integrates expansive glazing, clean geometric volumes, and refined material palettes to create a residence that is both aspirational and deeply liveable.",
    sourceDir: path.join(BASE, "AJ RESIDENCE", "AJ RESIDENCE"),
    prefix: "aj-residence",
  },
  {
    sectionTitle: "SA RESIDENCE",
    description:
      "SA Residence is a modern private dwelling conceived around natural light and open-plan living. Its bold facade, carefully articulated terraces, and landscaped surroundings reflect a commitment to architecture that elevates everyday life.",
    sourceDir: path.join(BASE, "SA RESIDENCE", "SA RESIDENCE"),
    prefix: "sa-residence",
  },
  {
    sectionTitle: "OS RESIDENCE",
    description:
      "OS Residence is a distinguished luxury home featuring a sculptural main gate entry and a resort-style pool terrace. The composition draws on classical proportions re-imagined through a contemporary lens to deliver a timeless sense of arrival and repose.",
    sourceDir: path.join(BASE, "residences", "OS RESIDENCE", "OS RESIDENCE"),
    prefix: "os-residence",
  },
  {
    sectionTitle: "E3 RESIDENCE",
    description:
      "E3 Residence is an architecturally refined residential development offering a curated selection of bespoke living environments. Each unit is designed to maximise natural ventilation, daylight penetration, and seamless indoor-outdoor connectivity.",
    sourceDir: path.join(BASE, "residences"),
    // E3 images sit directly in the residences folder, named "E3 *.jpg"
    fileFilter: (name) => /^E3\s*\(/i.test(name),
    prefix: "e3-residence",
  },
];

// ---------------------------------------------------------------------------
// Upload a single image file, reusing existing assets by filename prefix
// ---------------------------------------------------------------------------
async function uploadImage(filePath, prefixedFilename) {
  // Check if already uploaded (match on prefixed filename)
  const existingId = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $fn][0]._id',
    { fn: prefixedFilename },
  );
  if (existingId) {
    console.log(`  ✓ reusing ${prefixedFilename}`);
    return existingId;
  }

  let bytes = readFileSync(filePath);
  let assetId;
  try {
    assetId = (
      await client.assets.upload("image", bytes, {
        filename: prefixedFilename,
        contentType: "image/jpeg",
      })
    )._id;
  } catch (err) {
    console.log(`  ⚠ re-encoding ${prefixedFilename} (${err.message})`);
    bytes = await sharp(bytes, { failOn: "none" })
      .jpeg({ quality: 92 })
      .toBuffer();
    assetId = (
      await client.assets.upload("image", bytes, {
        filename: prefixedFilename,
        contentType: "image/jpeg",
      })
    )._id;
  }
  console.log(`  ↑ uploaded ${prefixedFilename}`);
  return assetId;
}

// ---------------------------------------------------------------------------
// Upload all images for every section and collect asset references
// ---------------------------------------------------------------------------
const sectionAssets = []; // parallel to SECTIONS

for (const section of SECTIONS) {
  console.log(`\n── ${section.sectionTitle} ──`);

  if (!existsSync(section.sourceDir)) {
    throw new Error(`Source directory not found: ${section.sourceDir}`);
  }

  const filter = section.fileFilter ?? ((name) => /\.(jpe?g|png)$/i.test(name));
  const filenames = readdirSync(section.sourceDir)
    .filter((name) => filter(name) && /\.(jpe?g|png)$/i.test(name))
    .sort((a, b) => {
      // Natural sort so 1.jpg < 2.jpg < 10.jpg
      const num = (s) => parseInt(s.match(/\d+/)?.[0] ?? "0", 10);
      return num(a) - num(b) || a.localeCompare(b);
    });

  if (filenames.length === 0) {
    throw new Error(`No images found in ${section.sourceDir} for ${section.sectionTitle}.`);
  }

  console.log(`  ${filenames.length} image(s) found`);

  const assetIds = [];
  for (const filename of filenames) {
    const filePath = path.join(section.sourceDir, filename);
    const prefixed = `${section.prefix}--${filename}`;
    const id = await uploadImage(filePath, prefixed);
    assetIds.push(id);
  }

  sectionAssets.push(assetIds);
}

// ---------------------------------------------------------------------------
// Patch the architecturePage document (published + draft)
// ---------------------------------------------------------------------------
for (const documentId of ["architecturePage", "drafts.architecturePage"]) {
  const doc = await client.fetch(
    "*[_id == $id][0]{_id,_rev,projects}",
    { id: documentId },
  );
  if (!doc) {
    console.log(`\nSkipping ${documentId}: document not present.`);
    continue;
  }

  console.log(`\n── Patching ${documentId} ──`);

  // Find the RESIDENCES project entry
  const matches = (doc.projects ?? [])
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.title?.trim().toLowerCase() === "residences");

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one RESIDENCES project in ${documentId}, found ${matches.length}; no changes made.`,
    );
  }

  const { entry, index } = matches[0];

  // Build the updated sections array — merge new sections in, preserve any others
  const existingSections = [...(entry.sections ?? [])];

  for (let i = 0; i < SECTIONS.length; i++) {
    const { sectionTitle, description } = SECTIONS[i];
    const assetIds = sectionAssets[i];

    // Check if a section with this title already exists
    const secIdx = existingSections.findIndex(
      (s) => s.title?.trim().toLowerCase() === sectionTitle.toLowerCase(),
    );

    if (secIdx >= 0) {
      // Merge new images into existing section
      const existing = existingSections[secIdx];
      const existingRefs = new Set(
        (existing.images ?? []).map((img) => img?.asset?._ref).filter(Boolean),
      );
      const merged = [...(existing.images ?? [])];
      let added = 0;
      for (const assetId of assetIds) {
        if (existingRefs.has(assetId)) continue;
        merged.push({
          _key: randomBytes(6).toString("hex"),
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
        });
        existingRefs.add(assetId);
        added++;
      }
      existingSections[secIdx] = {
        ...existing,
        title: sectionTitle,
        description: existing.description || description,
        images: merged,
      };
      console.log(`  "${sectionTitle}": ${added} image(s) added (${merged.length} total).`);
    } else {
      // Create new section
      existingSections.push({
        _key: randomBytes(6).toString("hex"),
        _type: "object",
        title: sectionTitle,
        description,
        images: assetIds.map((assetId) => ({
          _key: randomBytes(6).toString("hex"),
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
        })),
      });
      console.log(`  "${sectionTitle}": created with ${assetIds.length} image(s).`);
    }
  }

  // Also update the RESIDENCES project mainImage if it has none — use first image of AJ RESIDENCE
  const hasMainImage = !!entry.mainImage?.asset;
  const mainImagePatch = !hasMainImage
    ? {
        mainImage: {
          _type: "image",
          asset: { _type: "reference", _ref: sectionAssets[0][0] },
          alt: "AJ Residence exterior view",
        },
      }
    : {};

  const nextProjects = [...doc.projects];
  nextProjects[index] = {
    ...entry,
    ...mainImagePatch,
    sections: existingSections,
  };

  await client
    .patch(doc._id)
    .ifRevisionId(doc._rev)
    .set({ projects: nextProjects })
    .commit();

  console.log(
    `  ✓ ${documentId} updated — RESIDENCES now has ${existingSections.length} section(s).`,
  );
}

console.log("\n✅ Done. All residence sections are live in Sanity.");
