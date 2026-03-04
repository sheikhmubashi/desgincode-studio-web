import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const NEWS_POSTS_QUERY = defineQuery(`
  *[_type == "newsPost"] | order(_createdAt desc) {
    _id,
    title,
    content
  }
`);

export type NewsPostSummary = {
 _id: string;
 title: string | null;
 content: string | null;
};

export async function getNewsPosts(): Promise<NewsPostSummary[]> {
 const { data } = await sanityFetch({ query: NEWS_POSTS_QUERY });
 return data ?? [];
}
