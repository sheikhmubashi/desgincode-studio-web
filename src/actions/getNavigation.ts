import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";

const NAVIGATION_QUERY = defineQuery(`
  *[_type == "navigation" && _id == "navigation"][0] {
    title,
    navItems[] {
      label,
      href
    }
  }
`);

export type NavItem = {
 label: string;
 href: string;
};

export type NavigationData = {
 title: string | null;
 navItems: NavItem[] | null;
} | null;

export async function getNavigation(): Promise<NavigationData> {
 const { data } = await sanityFetch({ query: NAVIGATION_QUERY });
 return data ?? null;
}
