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
       name: "images",
       title: "Project Images",
       type: "array",
       of: [
        {
         type: "image",
         options: { hotspot: true },
        },
       ],
      }),
      defineField({
       name: "description",
       title: "Description",
       type: "text",
       rows: 3,
      }),
      defineField({
       name: "location",
       title: "Location",
       type: "text",
       rows: 2,
      }),
     ],
     preview: {
      select: { title: "title", subtitle: "location", images: "images" },
      prepare({ title, subtitle, images }) {
       return {
        title,
        subtitle,
        media: images && images.length > 0 ? images[0] : null,
       };
      },
     },
    },
   ],
  }),
 ],
 preview: {
  prepare: () => ({ title: "Interiors Page" }),
 },
});
