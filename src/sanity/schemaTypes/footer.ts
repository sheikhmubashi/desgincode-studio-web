import { defineField, defineType } from "sanity";

export const footer = defineType({
 name: "footer",
 title: "Footer",
 type: "document",
 fields: [
  defineField({
   name: "copyright",
   title: "Copyright Text",
   type: "string",
   initialValue: "© 2026 Design Code Studio. All Rights Reserved",
  }),
  defineField({
   name: "socialLinks",
   title: "Social Links",
   type: "array",
   of: [
    {
     type: "object",
     name: "socialLink",
     title: "Social Link",
     fields: [
      defineField({
       name: "platform",
       title: "Platform",
       type: "string",
       options: { list: ["facebook", "instagram", "linkedin", "twitter"] },
       validation: (r) => r.required(),
      }),
      defineField({
       name: "url",
       title: "URL",
       type: "url",
       validation: (r) => r.required(),
      }),
     ],
     preview: {
      select: { title: "platform", subtitle: "url" },
     },
    },
   ],
  }),
 ],
 preview: {
  select: { title: "copyright" },
 },
});
