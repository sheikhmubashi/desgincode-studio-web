import { defineField, defineType } from "sanity";

// Architecture Page with categories
export const architecturePage = defineType({
 name: "architecturePage",
 title: "Architecture Page",
 type: "document",
 fields: [
  defineField({
   name: "pageTitle",
   title: "Page Title",
   type: "string",
   initialValue: "ARCHITECTURE",
  }),
  defineField({
   name: "categories",
   title: "Categories",
   type: "array",
   of: [
    {
     type: "object",
     name: "category",
     title: "Category",
     fields: [
      defineField({
       name: "title",
       title: "Category Title",
       type: "string",
       options: {
        list: [
         { title: "RESIDENCES", value: "RESIDENCES" },
         { title: "BUILDINGS", value: "BUILDINGS" },
         { title: "MIXED-USE DEVELOPMENT", value: "MIXED-USE DEVELOPMENT" },
        ],
       },
       validation: (Rule) => Rule.required(),
      }),
      defineField({
       name: "slug",
       title: "Slug",
       type: "slug",
       options: { source: "title" },
       validation: (Rule) => Rule.required(),
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
          defineField({
           name: "title",
           title: "Project Title",
           type: "string",
           validation: (Rule) => Rule.required(),
          }),
          defineField({
           name: "slug",
           title: "Slug",
           type: "slug",
           options: { source: "title" },
           validation: (Rule) => Rule.required(),
          }),
          defineField({
           name: "mainImage",
           title: "Main Image",
           type: "image",
           options: { hotspot: true },
           fields: [
            defineField({
             name: "alt",
             title: "Alternative Text",
             type: "string",
            }),
           ],
          }),
          defineField({
           name: "images",
           title: "Images Array",
           type: "array",
           of: [
            {
             type: "image",
             options: { hotspot: true },
             fields: [
              defineField({
               name: "alt",
               title: "Alternative Text",
               type: "string",
              }),
             ],
            },
           ],
          }),
          defineField({
           name: "content",
           title: "Content",
           type: "array",
           of: [{ type: "block" }],
          }),
         ],
         preview: {
          select: {
           title: "title",
           media: "mainImage",
          },
         },
        },
       ],
      }),
     ],
     preview: {
      select: {
       title: "title",
      },
     },
    },
   ],
  }),
 ],
 preview: {
  prepare: () => ({ title: "Architecture Page" }),
 },
});
