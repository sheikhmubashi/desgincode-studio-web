import { defineField, defineType } from "sanity";

export const contactPage = defineType({
 name: "contactPage",
 title: "Contact Us Page",
 type: "document",
 fields: [
  defineField({
   name: "pageTitle",
   title: "Page Title",
   type: "string",
   initialValue: "Contact Us",
  }),
  defineField({
   name: "intro",
   title: "Intro / Tagline",
   type: "text",
   rows: 2,
  }),
  defineField({
   name: "bannerImage",
   title: "Banner Image",
   type: "image",
   options: {
    hotspot: true,
   },
   fields: [
    {
     name: "alt",
     title: "Alt Text",
     type: "string",
    },
   ],
   description: "Upload the banner image for the contact page",
  }),
  defineField({
   name: "address",
   title: "Office Address",
   type: "text",
   rows: 4,
   description: "Format your address with proper line breaks",
  }),
  defineField({
   name: "email",
   title: "Email Address",
   type: "string",
  }),
  defineField({
   name: "phone",
   title: "Phone Number",
   type: "string",
  }),
  defineField({
   name: "mapEmbedUrl",
   title: "Google Maps Embed URL",
   type: "url",
   description: "Paste the Google Maps embed URL here",
  }),
 ],
 preview: {
  prepare: () => ({
   title: "Contact Us Page",
  }),
 },
});
