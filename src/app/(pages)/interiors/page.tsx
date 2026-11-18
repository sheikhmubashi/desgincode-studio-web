import type { Metadata } from "next";
import { getInteriorsPage } from "@/actions/getInteriorsPage";
import InteriorsExplorer from "@/components/interiors/InteriorsExplorer";

export const metadata: Metadata = {
 title: "Interiors",
 description:
  "Explore our interior design projects — corporate, hospitality and residential spaces.",
};

export default async function InteriorsPage() {
 const data = await getInteriorsPage();
 return (
  <InteriorsExplorer projects={data?.projects ?? []} />
 );
}
