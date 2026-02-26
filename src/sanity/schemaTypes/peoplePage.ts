import { defineField, defineType } from "sanity";

export const peoplePage = defineType({
 name: "peoplePage",
 title: "People Page",
 type: "document",
 fields: [
  defineField({
   name: "pageTitle",
   title: "Page Title",
   type: "string",
   initialValue: "People",
  }),
  defineField({
   name: "intro",
   title: "Intro Text",
   type: "text",
   rows: 3,
  }),
  defineField({
   name: "team",
   title: "Team Members",
   type: "array",
   of: [
    {
     type: "object",
     name: "teamMember",
     title: "Team Member",
     fields: [
      defineField({
       name: "name",
       title: "Name",
       type: "string",
       validation: (Rule) => Rule.required(),
      }),
      defineField({
       name: "role",
       title: "Role",
       type: "string",
       validation: (Rule) => Rule.required(),
      }),
      defineField({
       name: "bio",
       title: "Biography",
       type: "text",
       rows: 5,
      }),
      defineField({
       name: "image",
       title: "Profile Image",
       type: "image",
       options: { hotspot: true },
       fields: [
        {
         name: "alt",
         title: "Alt Text",
         type: "string",
        },
       ],
      }),
     ],
     preview: {
      select: {
       title: "name",
       subtitle: "role",
       media: "image",
      },
     },
    },
   ],
  }),
 ],
 preview: {
  select: {
   title: "pageTitle",
  },
 },
});
