import type { StructureResolver } from "sanity/structure";

// Singleton document types (only one document allowed)
const SINGLETONS = [
 "navigation",
 "footer",
 "aboutPage",
 "architecturePage",
 "interiorsPage",
 "peoplePage",
 "contactPage",
];

export const structure: StructureResolver = (S) =>
 S.list()
  .title("Content")
  .items([
   // ── Singletons ──
   S.listItem()
    .title("Navigation")
    .id("navigation")
    .child(S.document().schemaType("navigation").documentId("navigation")),

   S.listItem()
    .title("Footer")
    .id("footer")
    .child(S.document().schemaType("footer").documentId("footer")),

   S.divider(),

   S.listItem()
    .title("About Us Page")
    .id("aboutPage")
    .child(S.document().schemaType("aboutPage").documentId("aboutPage")),

   //  S.listItem()
   //   .title("Architecture Page")
   //   .id("architecturePage")
   //   .child(
   //    S.document().schemaType("architecturePage").documentId("architecturePage"),
   //   ),

   //  S.listItem()
   //   .title("Interiors Page")
   //   .id("interiorsPage")
   //   .child(
   //    S.document().schemaType("interiorsPage").documentId("interiorsPage"),
   //   ),

   S.listItem()
    .title("People Page")
    .id("peoplePage")
    .child(S.document().schemaType("peoplePage").documentId("peoplePage")),

   S.listItem()
    .title("Contact Us Page")
    .id("contactPage")
    .child(S.document().schemaType("contactPage").documentId("contactPage")),

   S.divider(),

   // ── Multi-document ──
   ...S.documentTypeListItems().filter(
    (item) => item.getId() && !SINGLETONS.includes(item.getId()!),
   ),
  ]);
