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

const client = createClient({
 projectId,
 dataset,
 apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-19",
 token,
 useCdn: false,
});

// Newer API versions hide draft documents by default; keep Studio's draft in sync.
const draftClient = client.withConfig({ apiVersion: "2024-01-01" });

const renames = [
 ["NK Residence Interiors", "NK RESIDENCE INTERIORS"],
 ["AB Interior", "AB INTERIOR"],
 ["KI Interior", "KI INTERIOR"],
 ["Kasimali Residence", "KASIMALI RESIDENCE"],
 ["FK Interior", "FK INTERIOR"],
 ["Syngenta Factory Cafeteria", "SYNGENTA FACTORY CAFETERIA"],
 ["QG Head Office", "QG HEAD OFFICE"],
 ["Pangs Salon", "PENG'S SALON - DHA PHASE 01"],
 ["Office for MTU", "OFFICE FOR MTU"],
 ["Peng's Atelier - Gulshan", "PENG'S ATELIER - GULSHAN"],
];

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

 const nextProjects = [...(doc.projects ?? [])];
 let changed = 0;

 for (const [from, to] of renames) {
  const matches = nextProjects
   .map((project, index) => ({ project, index }))
   .filter(({ project }) => project.title?.trim().toLowerCase() === from.toLowerCase());

  if (matches.length > 1) {
   throw new Error(`Multiple projects titled "${from}" in ${documentId}; no changes made.`);
  }
  if (matches.length === 0) continue;
  if (matches[0].project.title === to) continue;

  nextProjects[matches[0].index] = { ...matches[0].project, title: to };
  changed++;
 }

 const titles = nextProjects.map((project) => project.title?.trim().toLowerCase());
 const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
 if (duplicates.length > 0) {
  throw new Error(`Duplicate project titles after rename in ${documentId}: ${duplicates.join(", ")}; no changes made.`);
 }

 if (changed === 0) {
  console.log(`${documentId}: all project titles already normalized.`);
  continue;
 }

 await targetClient.patch(doc._id).ifRevisionId(doc._rev).set({ projects: nextProjects }).commit();
 console.log(`${documentId}: renamed ${changed} project title(s).`);
 for (const project of nextProjects) console.log(`  ${project.title}`);
}
