import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
 name: "aboutPage",
 title: "About Us Page",
 type: "document",
 fields: [
  defineField({
   name: "heroImage",
   title: "Hero Banner Image",
   type: "image",
   options: { hotspot: true },
  }),
  defineField({
   name: "aboutTitle",
   title: "About Us – Title",
   type: "string",
   initialValue: "About Us",
  }),
  defineField({
   name: "aboutBody",
   title: "About Us – Body",
   type: "text",
   rows: 4,
  }),
  defineField({
   name: "servicesTitle",
   title: "Our Services – Title",
   type: "string",
   initialValue: "Our Services",
  }),
  defineField({
   name: "servicesBody",
   title: "Our Services – Body",
   type: "text",
   rows: 4,
  }),
  defineField({
   name: "approachTitle",
   title: "Our Design Approach – Title",
   type: "string",
   initialValue: "Our Design Approach",
  }),
  defineField({
   name: "approachParagraphs",
   title: "Our Design Approach – Paragraphs",
   type: "array",
   of: [{ type: "text" }],
   description: "Add each paragraph as a separate item",
  }),
 ],
 preview: {
  prepare: () => ({ title: "About Us Page" }),
 },
});
