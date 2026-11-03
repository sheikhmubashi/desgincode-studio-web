import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const INTERIORS_PAGE_QUERY = defineQuery(`
  *[_type == "interiorsPage" && _id == "interiorsPage"][0] {
    pageTitle,
    projects[] {
      title,
      category,
      images[] {
        asset->{ url, metadata{ dimensions{ width, height } } },
        alt,
        _key
      },
      description,
      location
    }
  }
`);

export type InteriorsProject = {
 title: string | null;
 category: string | null;
 images:
  | {
     _key?: string;
     asset: {
      url: string;
      metadata?: { dimensions?: { width: number; height: number } };
     } | null;
     alt?: string | null;
    }[]
  | null;
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
