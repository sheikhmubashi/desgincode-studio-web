import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const PEOPLE_PAGE_QUERY = defineQuery(`
  *[_type == "peoplePage" && _id == "peoplePage"][0] {
    pageTitle,
    intro,
    team[] {
      name,
      role,
      bio,
      image {
        asset->{ url },
        alt
      }
    }
  }
`);

export type TeamMember = {
 name: string | null;
 role: string | null;
 bio: string | null;
 image: { asset: { url: string }; alt?: string } | null;
};

export type PeoplePageData = {
 pageTitle: string | null;
 intro: string | null;
 team: TeamMember[] | null;
} | null;

export async function getPeoplePage(): Promise<PeoplePageData> {
 const { data } = await sanityFetch({ query: PEOPLE_PAGE_QUERY });
 return data ?? null;
}
