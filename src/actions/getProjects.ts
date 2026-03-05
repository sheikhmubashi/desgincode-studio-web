// actions/getArchitecturePage.ts
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

// Query to get architecture page with all its nested projects
const ARCHITECTURE_PAGE_QUERY = defineQuery(`
  *[_type == "architecturePage"][0] {
    pageTitle,
    projects[] {
      title,
      "slug": slug.current,
      mainImage {
        asset,
        alt
      },
      images[] {
        asset,
        alt,
        _key
      },
      content
    }
  }
`);

// Query to get a single project by slug from the nested structure
const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "architecturePage"][0] {
    "project": projects[slug.current == $slug][0] {
      title,
      "slug": slug.current,
      mainImage {
        asset,
        alt
      },
      images[] {
        asset,
        alt,
        _key
      },
      content
    }
  }
`);

export type ProjectCard = {
 title: string;
 slug: string;any; alt?: string } | null;
};

export type ProjectDetail = {
 title: string;
 slug: string;
 mainImage: { asset: any; alt?: string } | null;
 images: { asset: any; alt?: string; _keyalt?: string } | null;
 images: { asset: { url: string }; alt?: string }[] | null;
 content: any | null;
};

export type ArchitecturePageData = {
 pageTitle: string;
 projects: ProjectCard[];
};

export async function getArchitecturePage(): Promise<ArchitecturePageData> {
 const { data } = await sanityFetch({ query: ARCHITECTURE_PAGE_QUERY });

 // Return default structure if no data
 return (
  data ?? {
   pageTitle: "Architecture",
   projects: [],
  }
 );
}

export async function getProjectBySlug(
 slug: string,
): Promise<ProjectDetail | null> {
 const { data } = await sanityFetch({
  query: PROJECT_BY_SLUG_QUERY,
  params: { slug },
 });

 return data ?? null;
}
