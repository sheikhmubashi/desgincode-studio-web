import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { createClient } from "next-sanity";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
 throw new Error("Missing Sanity project/dataset/token environment values.");
}

const client = createClient({
 projectId,
 dataset,
 apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
 token,
 useCdn: false,
});

// Newer API versions hide draft documents by default; keep Studio's draft in sync.
const draftClient = client.withConfig({ apiVersion: "2024-01-01" });

const sectionTitle = "TABANI'S RESIDENCE";
const sectionDescription = "A residential project by Design Code Studio.";

const tabaniAssetIds = await client.fetch(
 `*[_type == "sanity.imageAsset" && (originalFilename match "*3.57*" || originalFilename match "*tabani*")]._id`,
);
const tabaniRefs = new Set(tabaniAssetIds);
console.log(`Found ${tabaniRefs.size} Tabani image asset(s).`);

if (tabaniRefs.size === 0) {
 throw new Error("No Tabani assets found; no changes made.");
}

for (const documentId of ["architecturePage", "drafts.architecturePage"]) {
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
  .filter(({ entry }) => entry.title?.trim().toLowerCase() === "residences");

 if (matches.length !== 1) {
  throw new Error(
   `Expected one RESIDENCES project in ${documentId}, found ${matches.length}; no changes made.`,
  );
 }

 const { entry, index } = matches[0];
 const mainImages = [...(entry.images ?? [])];
 const tabaniImages = mainImages.filter((image) =>
  tabaniRefs.has(image?.asset?._ref),
 );

 if (tabaniImages.length === 0) {
  console.log(`${documentId}: no Tabani images left in RESIDENCES images[].`);
 }

 const remainingImages = mainImages.filter(
  (image) => !tabaniRefs.has(image?.asset?._ref),
 );

 const sections = [...(entry.sections ?? [])];
 const sectionIndex = sections.findIndex(
  (section) => section.title?.trim().toLowerCase() === sectionTitle.toLowerCase(),
 );

 if (sectionIndex >= 0) {
  const existing = sections[sectionIndex];
  const existingRefs = new Set(
   (existing.images ?? []).map((image) => image?.asset?._ref).filter(Boolean),
  );
  const merged = [...(existing.images ?? [])];
  let added = 0;
  for (const image of tabaniImages) {
   if (existingRefs.has(image?.asset?._ref)) continue;
   merged.push(image);
   existingRefs.add(image?.asset?._ref);
   added++;
  }
  sections[sectionIndex] = {
   ...existing,
   title: sectionTitle,
   description: existing.description || sectionDescription,
   images: merged,
  };
  console.log(
   `${documentId}: section "${sectionTitle}" now has ${merged.length} image(s) (+${added}).`,
  );
 } else {
  sections.push({
   _key: randomBytes(6).toString("hex"),
   _type: "object",
   title: sectionTitle,
   description: sectionDescription,
   images: tabaniImages.map((image) => ({
    ...image,
    _key: randomBytes(6).toString("hex"),
   })),
  });
  console.log(
   `${documentId}: created "${sectionTitle}" with ${tabaniImages.length} image(s).`,
  );
 }

 const nextProjects = [...doc.projects];
 nextProjects[index] = {
  ...entry,
  images: remainingImages,
  sections,
 };
 await targetClient
  .patch(doc._id)
  .ifRevisionId(doc._rev)
  .set({ projects: nextProjects })
  .commit();
 console.log(
  `${documentId}: RESIDENCES main images ${mainImages.length} -> ${remainingImages.length}.`,
 );
}
