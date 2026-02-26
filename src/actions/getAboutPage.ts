import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage" && _id == "aboutPage"][0] {
    heroImage { asset->{ url }, alt },
    aboutTitle,
    aboutBody,
    servicesTitle,
    servicesBody,
    approachTitle,
    approachParagraphs
  }
`);

export type AboutPageData = {
 heroImage: { asset: { url: string }; alt?: string } | null;
 aboutTitle: string | null;
 aboutBody: string | null;
 servicesTitle: string | null;
 servicesBody: string | null;
 approachTitle: string | null;
 approachParagraphs: string[] | null;
} | null;

export async function getAboutPage(): Promise<AboutPageData> {
 const { data } = await sanityFetch({ query: ABOUT_PAGE_QUERY });
 return data ?? null;
}
