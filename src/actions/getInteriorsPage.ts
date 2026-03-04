import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const INTERIORS_PAGE_QUERY = defineQuery(`
  *[_type == "interiorsPage" && _id == "interiorsPage"][0] {
    pageTitle,
    projects[] {
      title,
      images[] { asset->{ url }, alt },
      description,
      location
    }
  }
`);

export type InteriorsProject = {
 title: string | null;
 images: { asset: { url: string }; alt?: string }[] | null;
 description: string | null;
 location: string | null;
};

export type InteriorsPageData = {
 pageTitle: string | null;
 projects: InteriorsProject[] | null;
} | null;

export async function getInteriorsPage(): Promise<InteriorsPageData> {
 const { data } = await sanityFetch({ query: INTERIORS_PAGE_QUERY });
 return data ?? null;
}
