import { defineField, defineType } from "sanity";

export const interiorsPage = defineType({
 name: "interiorsPage",
 title: "Interiors Page",
 type: "document",
 fields: [
  defineField({
   name: "pageTitle",
   title: "Page Title",
   type: "string",
   initialValue: "Interiors",
  }),
  defineField({
   name: "heroImage",
   title: "Hero Banner Image",
   type: "image",
   options: { hotspot: true },
  }),
  defineField({
   name: "intro",
   title: "Introduction Text",
   type: "text",
   rows: 4,
  }),
  defineField({
   name: "projects",
   title: "Projects",
   type: "array",
   of: [
    {
     type: "object",
     name: "project",
     title: "Project",
     fields: [
      defineField({ name: "title", title: "Project Title", type: "string" }),
      defineField({
       name: "image",
       title: "Project Image",
       type: "image",
       options: { hotspot: true },
      }),
      defineField({
       name: "description",
       title: "Description",
       type: "text",
       rows: 3,
      }),
      defineField({ name: "year", title: "Year", type: "string" }),
      defineField({ name: "location", title: "Location", type: "string" }),
     ],
     preview: {
      select: { title: "title", subtitle: "location", media: "image" },
     },
    },
   ],
  }),
 ],
 preview: {
  prepare: () => ({ title: "Interiors Page" }),
 },
});
