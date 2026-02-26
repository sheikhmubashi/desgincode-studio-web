import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage" && _id == "contactPage"][0] {
    pageTitle,
    intro,
    bannerImage {
      asset->{
        _id,
        url
      },
      alt
    },
    email,
    phone,
    address,
    mapEmbedUrl
  }
`);

export type ContactPageData = {
 pageTitle: string | null;
 intro: string | null;
 bannerImage: {
  asset: {
   _id: string;
   url: string;
  };
  alt: string | null;
 } | null;
 email: string | null;
 phone: string | null;
 address: string | null;
 mapEmbedUrl: string | null;
} | null;

export async function getContactPage(): Promise<ContactPageData> {
 const { data } = await sanityFetch({ query: CONTACT_PAGE_QUERY });
 return data ?? null;
}
