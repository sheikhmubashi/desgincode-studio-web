// app/architecture/[slug]/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/actions/getProjects";
import { PortableText } from "next-sanity";
import ArchitectureGallery, {
 type ArchitectureGalleryGroup,
} from "@/components/architecture/ArchitectureGallery";

export async function generateMetadata({
 params,
}: {
 params: Promise<{ slug: string }>;
}): Promise<Metadata> {
 const { slug } = await params;
 const result = await getProjectBySlug(slug);
 const project = result?.project;

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
 const result = await getProjectBySlug(slug);
 const project = result?.project;

 if (!project) {
  notFound();
 }

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

   {/* Images and named sub-sections, sharing one lightbox */}
   <ArchitectureGallery
    groups={
     [
      {
       key: project.slug || "main",
       title: project.title,
       images: project.images,
      },
      ...(project.sections ?? []).map((section, index) => ({
       key: section.title || `section-${index}`,
       title: section.title || `Section ${index + 1}`,
       description: section.description,
       images: section.images,
       showTitle: true,
      })),
     ] as ArchitectureGalleryGroup[]
    }
   />
  </div>
 );
}
