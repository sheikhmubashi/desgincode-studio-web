import { getArchitecturePage } from "@/actions/getProjects";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
 title: "Architecture",
};

export default async function ArchitecturePage() {
 console.log("Rendering ArchitecturePage");
 const data = await getArchitecturePage();

 console.log("Processed data:", {
  pageTitle: data.pageTitle,
  projectsCount: data.projects?.length,
  projects: data.projects,
 });

 const projects = data.projects || [];

 return (
  <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-20">
   {/* Title */}
   <h1 className="heading-page text-2xl lg:text-5xl mb-6">
    {data?.pageTitle ?? "ARCHITECTURE"}
   </h1>

   {/* Projects Grid - Exact dimensions like your design */}
   {projects.length > 0 ? (
    <div className="flex flex-wrap items-end justify-between">
     {projects.map((project, index) => {
      // Apply different dimensions based on index
      let width = 400;
      let height = 400;

      if (index === 0) {
       // Residences
       width = 471;
       height = 249;
      } else if (index === 1) {
       // Buildings
       width = 396;
       height = 361;
      } else if (index === 2) {
       // Mixed-Use
       width = 302;
       height = 529;
      }

      // Generate image URL using urlFor if asset exists
      const imageUrl = project.mainImage?.asset
       ? urlFor(project.mainImage.asset).url()
       : null;

      return (
       <Link
        key={project.slug}
        href={`/architecture/${project.slug}`}
        className="group block"
       >
        <article>
         {imageUrl && (
          <div className="overflow-hidden">
           <Image
            src={imageUrl}
            alt={project.mainImage?.alt ?? project.title}
            width={width}
            height={height}
            className="object-cover"
            style={{
             width: `${width}px`,
             height: `${height}px`,
            }}
           />
          </div>
         )}
        </article>
       </Link>
      );
     })}
    </div>
   ) : (
    <p className="text-gray-500">No projects found.</p>
   )}
  </div>
 );
}
