import { createRequire } from "node:module";
import { createClient } from "next-sanity";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

const client = createClient({
 projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
 dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
 apiVersion: "2026-02-19",
 token: process.env.SANITY_API_TOKEN,
 useCdn: false,
});

// Newer API versions hide draft documents by default; keep Studio's draft in sync.
const draftClient = client.withConfig({ apiVersion: "2024-01-01" });

// Display rule: "<City> – <Area>" -> Location: City, Category: Area.
// Values verified from client instructions and public business listings.
const locations = {
 "NK RESIDENCE INTERIORS": "Karachi – 1000 sq yard private residence",
 "AB INTERIOR": "Karachi – Emaar, 4 Bedroom Apartment",
 "KI INTERIOR": "Karachi – Emaar, 4 Bedroom Apartment",
 "KASIMALI RESIDENCE": "Karachi – 666 sq yard private residence",
 "FK INTERIOR": "Karachi – Emaar, 4 Bedroom Apartment",
 "SYNGENTA FACTORY CAFETERIA": "Karachi – S.I.T.E",
 "QG HEAD OFFICE": "Karachi",
 "PENG'S SALON - DHA PHASE 01": "Karachi – DHA Phase 01",
 "PENG'S SALON": "Karachi – Clifton",
 "PENG'S ATELIER - GULSHAN": "Karachi – Gulshan-e-Iqbal",
 "GUINOT INSTITUTE": "Karachi – DHA Phase 6",
 // OFFICE FOR MTU: left blank — no reliable Karachi location found.
 // HEIMTEX 2026 - REGAL TEXTILES: already correct ("Frankfurt, Germany").
};

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

 const projects = [...(doc.projects ?? [])];
 let changed = 0;

 for (const [title, location] of Object.entries(locations)) {
  const index = projects.findIndex(
   (project) => project.title?.trim().toLowerCase() === title.toLowerCase(),
  );
  if (index < 0) {
   console.log(`  ${documentId}: project "${title}" not found.`);
   continue;
  }
  if (projects[index].location === location) continue;
  projects[index] = { ...projects[index], location };
  changed++;
 }

 if (changed === 0) {
  console.log(`${documentId}: all locations already up to date.`);
  continue;
 }

 await targetClient
  .patch(doc._id)
  .ifRevisionId(doc._rev)
  .set({ projects })
  .commit();
 console.log(`${documentId}: updated ${changed} location(s).`);
}
