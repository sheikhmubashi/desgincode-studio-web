import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const ARCHITECTURE_PAGE_QUERY = defineQuery(`
  *[_type == "architecturePage" && _id == "architecturePage"][0] {
    pageTitle,
    heroImage { asset->{ url }, alt },
    intro,
    projects[] {
      title,
      image { asset->{ url }, alt },
      description,
      year,
      location
    }
  }
`);

export type Project = {
 title: string | null;
 image: { asset: { url: string }; alt?: string } | null;
 description: string | null;
 year: string | null;
 location: string | null;
};

export type ArchitecturePageData = {
 pageTitle: string | null;
 heroImage: { asset: { url: string }; alt?: string } | null;
 intro: string | null;
 projects: Project[] | null;
} | null;

export async function getArchitecturePage(): Promise<ArchitecturePageData> {
 const { data } = await sanityFetch({ query: ARCHITECTURE_PAGE_QUERY });
 return data ?? null;
}
