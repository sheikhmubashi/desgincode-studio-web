import { defineField, defineType } from "sanity";

export const navigation = defineType({
 name: "navigation",
 title: "Navigation",
 type: "document",
 fields: [
  defineField({
   name: "title",
   title: "Internal Title",
   type: "string",
   initialValue: "Main Navigation",
  }),
  defineField({
   name: "navItems",
   title: "Navigation Links",
   type: "array",
   of: [
    {
     type: "object",
     name: "navItem",
     title: "Nav Item",
     fields: [
      defineField({
       name: "label",
       title: "Label",
       type: "string",
       validation: (r) => r.required(),
      }),
      defineField({
       name: "href",
       title: "URL / Path",
       type: "string",
       validation: (r) => r.required(),
      }),
     ],
     preview: {
      select: { title: "label", subtitle: "href" },
     },
    },
   ],
  }),
 ],
 preview: {
  select: { title: "title" },
 },
});
