import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const FOOTER_QUERY = defineQuery(`
  *[_type == "footer" && _id == "footer"][0] {
    copyright,
    socialLinks[] {
      platform,
      url
    }
  }
`);

export type SocialLink = {
 platform: string;
 url: string;
};

export type FooterData = {
 copyright: string | null;
 socialLinks: SocialLink[] | null;
} | null;

export async function getFooter(): Promise<FooterData> {
 const { data } = await sanityFetch({ query: FOOTER_QUERY });
 return data ?? null;
}
