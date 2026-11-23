import { defineField, defineType } from "sanity";

// Architecture Page with projects directly inside
export const architecturePage = defineType({
 name: "architecturePage",
 title: "Architecture Page",
 type: "document",
 fields: [
  defineField({
   name: "pageTitle",
   title: "Page Title",
   type: "string",
   initialValue: "Architecture",
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
       options: {
        source: "title",
        maxLength: 96,
       },
       validation: (Rule) => Rule.required(),
      }),
      defineField({
       name: "description",
       title: "Description",
       type: "text",
       rows: 3,
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
       validation: (Rule) => Rule.required(),
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
       name: "sections",
       title: "Sub-sections",
       description:
        "Optional named groups of images shown below the main images on the project page.",
       type: "array",
       of: [
        {
         type: "object",
         name: "section",
         title: "Sub-section",
         fields: [
          defineField({
           name: "title",
           title: "Title",
           type: "string",
           validation: (Rule) => Rule.required(),
          }),
          defineField({
           name: "description",
           title: "Description",
           type: "text",
           rows: 3,
          }),
          defineField({
           name: "images",
           title: "Images",
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
         ],
         preview: {
          select: { title: "title" },
         },
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
  prepare: () => ({ title: "Architecture Page" }),
 },
});
