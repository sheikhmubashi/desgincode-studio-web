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
   name: "content",
   title: "Content",
   type: "text",
   rows: 5,
   description: "The main text of the news article",
  }),
 ],
 preview: {
  select: { title: "title" },
 },
});
