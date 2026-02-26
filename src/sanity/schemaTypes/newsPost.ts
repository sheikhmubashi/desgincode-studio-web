import { defineField, defineType } from "sanity";

export const newsPost = defineType({
 name: "newsPost",
 title: "News Post",
 type: "document",
 fields: [
  defineField({
   name: "title",
   title: "Title",
   type: "string",
   validation: (r) => r.required(),
  }),
  defineField({
   name: "slug",
   title: "Slug",
   type: "slug",
   options: { source: "title", maxLength: 96 },
   validation: (r) => r.required(),
  }),
  defineField({
   name: "publishedAt",
   title: "Published At",
   type: "datetime",
   initialValue: () => new Date().toISOString(),
  }),
  defineField({
   name: "heroImage",
   title: "Hero Image",
   type: "image",
   options: { hotspot: true },
  }),
  defineField({
   name: "excerpt",
   title: "Excerpt",
   type: "text",
   rows: 3,
   description: "Short summary shown in the news listing",
  }),
  defineField({
   name: "body",
   title: "Body",
   type: "array",
   of: [
    { type: "block" },
    {
     type: "image",
     options: { hotspot: true },
     fields: [
      defineField({ name: "alt", title: "Alt Text", type: "string" }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
     ],
    },
   ],
  }),
  defineField({
   name: "category",
   title: "Category",
   type: "string",
   options: {
    list: ["Architecture", "Interiors", "People", "News"],
   },
  }),
 ],
 orderings: [
  {
   title: "Published Date (newest)",
   name: "publishedAt",
   by: [{ field: "publishedAt", direction: "desc" }],
  },
 ],
 preview: {
  select: { title: "title", subtitle: "publishedAt", media: "heroImage" },
  prepare({ title, subtitle, media }) {
   return {
    title,
    subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : "No date",
    media,
   };
  },
 },
});
