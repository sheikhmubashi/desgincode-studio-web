import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const NEWS_POSTS_QUERY = defineQuery(`
  *[_type == "newsPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    heroImage { asset->{ url }, alt },
    excerpt,
    category
  }
`);

export type NewsPostSummary = {
 _id: string;
 title: string | null;
 slug: { current: string } | null;
 publishedAt: string | null;
 heroImage: { asset: { url: string }; alt?: string } | null;
 excerpt: string | null;
 category: string | null;
};

export async function getNewsPosts(): Promise<NewsPostSummary[]> {
 const { data } = await sanityFetch({ query: NEWS_POSTS_QUERY });
 return data ?? [];
}
