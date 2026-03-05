// app/architecture/[slug]/page.tsx
import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/actions/getProjects";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

export async function generateMetadata({
 params,
}: {
 params: Promise<{ slug: string }>;
}): Promise<Metadata> {
 const { slug } = await params;
 const result: any = await getProjectBySlug(slug);
 const project = result?.project || result;

 if (!project) {
  return { title: "Project Not Found" };
 }

 return {
  title: project.title,
 };
}

export default async function ProjectPage({
 params,
}: {
 params: Promise<{ slug: string }>;
}) {
 const { slug } = await params;
 const result: any = await getProjectBySlug(slug);
 console.log("Raw result:", result);

 // Handle both nested and direct project data
 const project = (result?.project as any) || result;
 console.log("Processed project:", project);

 if (!project) {
  notFound();
 }

 const getStyle = (index: number) => {
  switch (index) {
   case 0:
    return { top: "0px", left: "0px", width: "570px", height: "380px" };
   case 1:
    return { top: "190px", left: "594px", width: "536px", height: "357px" };
   case 2:
    return { top: "416px", left: "0px", width: "470px", height: "704px" };
   case 3:
    return { top: "930px", left: "495px", width: "570px", height: "380px" };
   default:
    return { display: "none" };
  }
 };

 return (
  <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10 pb-20 pt-10 relative">
   {/* Breadcrumb - ARCHITECTURE > RESIDENCES */}
   <div className="mb-6">
    <p className="font-oswald lg:text-5xl text-2xl font-semibold lg:leading-[71px] mb-8 text-black">
     <Link href="/architecture" className="hover:underline">
      ARCHITECTURE
     </Link>
     {" > "}
     {project.title}
    </p>
   </div>

   {/* Intro Text - Roboto Condensed 24px/32px */}
   {project.description && (
    <div className="mb-12 max-w-4xl">
     <p className="font-body md:text-2xl text-lg sm:text-xl mb-6 text-[#2E2E2E] last:mb">
      {project.description}
     </p>
    </div>
   )}

   {/* Content */}
   {project.content && (
    <div className="prose prose-lg mb-10 font-body md:text-2xl text-lg sm:text-xl text-[#2E2E2E] last:mb">
     <PortableText value={project.content} />
    </div>
   )}

   {/* Images Array */}
   {project.images && project.images.length > 0 && (
    <>
     {/* Mobile Layout (stacked) */}
     <section className="xl:hidden flex flex-col gap-8 w-full mt-10">
      {project.images?.slice(0, 4).map((image: any, index: number) => (
       <article key={image._key || index} className="w-full flex flex-col">
        <div className="relative w-full aspect-[4/3] bg-[#7F7F7F]">
         {image?.asset && (
          <Image
           src={urlFor(image.asset).url()}
           alt={image.alt || project.title || ""}
           fill
           className="object-cover"
          />
         )}
        </div>
       </article>
      ))}
     </section>

     {/* Desktop Layout (Grid Collage) */}
     <section className="hidden xl:block relative w-full h-[1400px]">
      {[0, 1, 2, 3].map((index) => {
       const style = getStyle(index);
       if (style.display === "none") return null;

       return (
        <article key={index} className="absolute inline-block" style={style}>
         {project.images?.[index]?.asset ? (
          <div className="w-full h-full relative bg-[#7F7F7F]">
           <Image
            src={urlFor(project.images[index].asset).url()}
            alt={project.images[index].alt || project.title || ""}
            fill
            className="object-cover"
           />
          </div>
         ) : (
          <div className="w-full h-full bg-[#7F7F7F]"></div>
         )}
        </article>
       );
      })}
     </section>
    </>
   )}
  </div>
 );
}
