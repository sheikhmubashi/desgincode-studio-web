"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { InteriorsProject } from "@/actions/getInteriorsPage";

type InteriorPhoto = {
 projectTitle: string;
 imageKey: string;
 src: string;
 alt: string;
 width: number;
 height: number;
};

type InteriorsExplorerProps = {
 projects: InteriorsProject[];
};

const categories = {
 residential: "Houses & Apartments",
 corporate: "Corporate",
 hospitality: "Hospitality",
} as const;

export default function InteriorsExplorer({ projects }: InteriorsExplorerProps) {
 const [branch, setBranch] = useState<"commercial" | "residential" | null>(null);
 const [commercialCategory, setCommercialCategory] = useState<
  "corporate" | "hospitality" | null
 >(null);
 const [isShowingResidentialProjects, setIsShowingResidentialProjects] =
  useState(false);
 const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

 const visibleProjects =
  branch === "residential" && isShowingResidentialProjects
   ? projects.filter((project) => project.category === categories.residential)
   : branch === "commercial" && commercialCategory
    ? projects.filter(
       (project) => project.category === categories[commercialCategory],
      )
    : [];

 const photos: InteriorPhoto[] = visibleProjects.flatMap((project) =>
  (project.images ?? []).flatMap((image, index) =>
   image?.asset?.url
    ? [
       {
        projectTitle: project.title ?? "Interior project",
        imageKey: image._key ?? `${project.title ?? "project"}-${index}`,
        src: image.asset.url,
        alt: image.alt || project.title || "Interior project",
        width: image.asset.metadata?.dimensions?.width ?? 1200,
        height: image.asset.metadata?.dimensions?.height ?? 900,
       },
      ]
    : [],
  ),
 );

 useEffect(() => {
  if (activePhotoIndex === null) return;

  const handleKeyDown = (event: KeyboardEvent) => {
   if (event.key === "Escape") setActivePhotoIndex(null);
   if (event.key === "ArrowRight") {
    setActivePhotoIndex((current) =>
     current === null ? null : (current + 1) % photos.length,
    );
   }
   if (event.key === "ArrowLeft") {
    setActivePhotoIndex((current) =>
     current === null ? null : (current - 1 + photos.length) % photos.length,
    );
   }
  };

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeyDown);

  return () => {
   document.body.style.overflow = previousOverflow;
   window.removeEventListener("keydown", handleKeyDown);
  };
 }, [activePhotoIndex, photos.length]);

 const resetNavigation = () => {
  setBranch(null);
  setCommercialCategory(null);
  setIsShowingResidentialProjects(false);
  setActivePhotoIndex(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
 };

 const showCommercialCategories = () => {
  setCommercialCategory(null);
  setActivePhotoIndex(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
 };

 const goBack = () => {
  if (branch === "commercial" && commercialCategory) {
   showCommercialCategories();
   return;
  }

  resetNavigation();
 };

 const openBranch = (nextBranch: "commercial" | "residential") => {
  setBranch(nextBranch);
  setCommercialCategory(null);
  setIsShowingResidentialProjects(nextBranch === "residential");
  setActivePhotoIndex(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
 };

 const openCommercialCategory = (category: "corporate" | "hospitality") => {
  setCommercialCategory(category);
  setActivePhotoIndex(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
 };

  const getProjectMetadata = (project: InteriorsProject) => {
   const rawLocation = project.location?.trim();
   const description =
    project.description?.trim() &&
    project.description.trim().toLowerCase() !== project.title?.trim().toLowerCase()
     ? project.description.trim()
     : null;

   if (!rawLocation) {
    return {
     location: null,
     category: description,
    };
   }

   if (rawLocation.toLowerCase() === project.title?.trim().toLowerCase()) {
    return {
     location: null,
     category: null,
    };
   }

   if (project.title === "Spang Salon") {
    const [area, city] = rawLocation.split(/\s+[–-]\s+/);
    return {
     location: city?.trim() ?? rawLocation,
     category: area?.trim() ?? null,
    };
   }

   const separatorMatch = rawLocation.match(/\s+[–-]\s+/);
   if (!separatorMatch || separatorMatch.index === undefined) {
    return {
     location: rawLocation,
     category: description,
    };
   }

   const separatorIndex = separatorMatch.index;
   return {
    location: rawLocation.slice(0, separatorIndex).trim(),
    category: rawLocation.slice(separatorIndex + separatorMatch[0].length).trim(),
   };
  };

 return (
  <div className="mx-auto max-w-7xl scroll-smooth px-4 py-10 lg:px-12 lg:py-16">
   <header className="mb-10">
    <h1 className="heading-page text-3xl text-black md:text-5xl">
     INTERIORS
    </h1>
   </header>

   {!branch && (
    <section aria-label="Interior categories" className="grid gap-6 md:grid-cols-2">
     <button
      type="button"
      onClick={() => openBranch("commercial")}
      className="group min-h-44 cursor-pointer border border-[#2E2E2E]/20 p-6 text-left transition-colors hover:bg-[#C3D6D4]/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E2E2E] md:p-8"
     >
      <span className="heading-page text-2xl text-black md:text-3xl">
       COMMERCIAL INTERIOR
      </span>
      <span className="body-text mt-3 block text-[#2E2E2E]">
       Corporate and Hospitality
      </span>
     </button>
     <button
      type="button"
      onClick={() => openBranch("residential")}
      className="group min-h-44 cursor-pointer border border-[#2E2E2E]/20 p-6 text-left transition-colors hover:bg-[#C3D6D4]/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E2E2E] md:p-8"
     >
      <span className="heading-page text-2xl text-black md:text-3xl">
        Residential Interior
      </span>
      <span className="body-text mt-3 block text-[#2E2E2E]">
       Houses and Apartments
      </span>
     </button>
    </section>
   )}

   {branch && (
    <div className="mb-8">
     <button
      type="button"
      onClick={goBack}
      className="nav-link mb-6 cursor-pointer underline underline-offset-4"
     >
      {branch === "commercial" && commercialCategory
       ? "← Commercial Interior"
       : "← All Interiors"}
     </button>
     {branch === "commercial" && commercialCategory && (
      <nav aria-label="Breadcrumb" className="mb-2">
       <ol className="flex flex-wrap  items-center gap-2 text-sm text-[#2E2E2E]">
        <li>
         <button
          type="button"
          onClick={resetNavigation}
          className="cursor-pointer underline underline-offset-2"
         >
          Interiors
         </button>
        </li>
        <li aria-hidden="true">/</li>
        <li>
         <button
          type="button"
          onClick={showCommercialCategories}
          className="cursor-pointer underline underline-offset-2"
         >
          Commercial Interior
         </button>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">
         {commercialCategory === "corporate"
          ? "Corporate"
          : "Hospitality"}
        </li>
       </ol>
      </nav>
     )}
     <h2 className="heading-page text-2xl text-black md:text-4xl [text-transform:none]">
      {branch === "commercial"
       ? commercialCategory === "corporate"
        ? "Corporate"
        : commercialCategory === "hospitality"
          ? "Hospitality"
         : "COMMERCIAL INTERIOR"
       : "Houses & Apartments"}
     </h2>
    </div>
   )}

   {branch === "commercial" && !commercialCategory && (
    <section aria-label="Commercial interior categories" className="grid gap-4 sm:grid-cols-2">
     <button
      type="button"
      onClick={() => openCommercialCategory("corporate")}
      className="border cursor-pointer border-[#2E2E2E]/20 p-5 text-left transition-colors hover:bg-[#C3D6D4]/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E2E2E]"
     >
      <span className="heading-page text-xl text-black md:text-2xl [text-transform:none]">
       Corporate
      </span>
     </button>
     <button
      type="button"
      onClick={() => openCommercialCategory("hospitality")}
      className="border cursor-pointer border-[#2E2E2E]/20 p-5 text-left transition-colors hover:bg-[#C3D6D4]/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E2E2E]"
     >
      <span className="heading-page text-xl text-black md:text-2xl [text-transform:none]">
       Hospitality
      </span>
     </button>
    </section>
   )}

   {visibleProjects.length > 0 && (
    <section className="mt-10 space-y-14">
     {visibleProjects.map((project, projectIndex) => {
      const projectPhotos = (project.images ?? []).flatMap((image, imageIndex) => {
       const src = image?.asset?.url;
       if (!src) return [];

       const key = image._key ?? `${project.title ?? "project"}-${imageIndex}`;
       return [
        {
         image,
         src,
         photoIndex: photos.findIndex((photo) => photo.imageKey === key),
         key,
        },
       ];
      });

      return (
       <article
        key={project.title ?? projectIndex}
        className="scroll-mt-8 border-b border-[#2E2E2E]/15 pb-10"
       >
        <header className="mb-3">
         <h3 className="heading-page text-2xl text-black md:text-3xl [text-transform:none]">
          {project.title ?? "Interior project"}
         </h3>
         {(() => {
          const metadata = getProjectMetadata(project);
          return (
           <div className="mt-1 leading-tight text-[#2E2E2E]">
            {metadata.location && (
             <p className="body-text whitespace-pre-line leading-tight">
              Location: {metadata.location}
             </p>
            )}
            {metadata.category && (
             <p className="body-text whitespace-pre-line leading-tight">
              Category: {metadata.category}
             </p>
            )}
           </div>
          );
         })()}
        </header>

        {projectPhotos.length > 0 ? (
         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {projectPhotos.map(({ image, src, photoIndex, key }, imageIndex) => (
           <button
            key={key}
            type="button"
            onClick={() => setActivePhotoIndex(photoIndex)}
            aria-label={`Enlarge image ${imageIndex + 1} of ${project.title ?? "project"}`}
            className="group relative aspect-[4/3] overflow-hidden bg-[#2E2E2E]/5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E2E2E]"
           >
            <Image
             src={src}
             alt={image?.alt || project.title || "Interior project"}
             fill
             sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
             className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
           </button>
          ))}
         </div>
        ) : (
         <p className="body-text text-[#2E2E2E]">Images coming soon.</p>
        )}
       </article>
      );
     })}
    </section>
   )}

   {((branch === "commercial" && commercialCategory) ||
    (branch === "residential" && isShowingResidentialProjects)) &&
    visibleProjects.length === 0 && (
     <p className="body-text mt-10 text-gray-500">No projects in this category yet.</p>
    )}

   {activePhotoIndex !== null && photos[activePhotoIndex] && (
    <div
     className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
     role="dialog"
     aria-modal="true"
     aria-label={`${photos[activePhotoIndex].projectTitle} project gallery`}
    >
     <button
      type="button"
      autoFocus
      onClick={() => setActivePhotoIndex(null)}
      aria-label="Close image viewer"
      className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
     >
      <X aria-hidden="true" size={18} strokeWidth={1.75} />
     </button>
     <button
      type="button"
      onClick={() =>
       setActivePhotoIndex(
        (activePhotoIndex - 1 + photos.length) % photos.length,
       )
      }
      aria-label="Previous image"
      className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white md:left-8"
     >
      <ChevronLeft aria-hidden="true" size={20} strokeWidth={1.75} />
     </button>
     <div className="relative h-[75vh] w-full max-w-6xl">
      <Image
       src={photos[activePhotoIndex].src}
       alt={photos[activePhotoIndex].alt}
       fill
       sizes="100vw"
       className="object-contain"
      />
      <p className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2 text-center text-sm text-white">
       {photos[activePhotoIndex].projectTitle} · {activePhotoIndex + 1} /{" "}
       {photos.length}
      </p>
     </div>
     <button
      type="button"
      onClick={() => setActivePhotoIndex((activePhotoIndex + 1) % photos.length)}
      aria-label="Next image"
      className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white md:right-8"
     >
      <ChevronRight aria-hidden="true" size={20} strokeWidth={1.75} />
     </button>
    </div>
   )}
  </div>
 );
}
