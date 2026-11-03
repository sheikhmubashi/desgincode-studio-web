import type { Metadata } from "next";
import Image from "next/image";
import { getInteriorsPage } from "@/actions/getInteriorsPage";

export const metadata: Metadata = {
 title: "Interiors",
 description:
  "Explore our interior design projects — corporate, hospitality and residential spaces.",
};

const collagePositions = [
 { top: 0, left: 0, width: 570, height: 380 },
 { top: 190, left: 594, width: 536, height: 357 },
 { top: 416, left: 0, width: 470, height: 704 },
 { top: 930, left: 495, width: 570, height: 380 },
];
const collageGroupOffset = 1390;

export default async function InteriorsPage() {
 const data = await getInteriorsPage();
 const projects = data?.projects || [];

 return (
  <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10 lg:pb-80 pt-10 relative">
   {projects.map((project, projectIndex) => {
    const images = (project.images ?? []).flatMap((image) =>
      image?.asset?.url
       ? [
          {
           ...image,
           src: image.asset.url,
           width: image.asset.metadata?.dimensions?.width ?? 800,
           height: image.asset.metadata?.dimensions?.height ?? 450,
          },
         ]
       : [],
     );
    const collageGroups = Math.ceil(images.length / collagePositions.length);
    const finalGroupImageCount =
     images.length % collagePositions.length || (images.length > 0 ? collagePositions.length : 0);
    const finalGroupHeight = collagePositions
     .slice(0, finalGroupImageCount)
     .reduce((height, position) => Math.max(height, position.top + position.height), 0);
    const collageHeight =
     collageGroups === 0
      ? 0
      : (collageGroups - 1) * collageGroupOffset +
        finalGroupHeight +
        (project.location && finalGroupImageCount <= 3 ? 80 : 0);

    return (
     <div
       key={project.title ?? projectIndex}
       className="mb-16 last:mb-0"
     >
       <section className="mb-6">
       <h1 className="heading-page text-2xl lg:text-5xl md:mb-8 text-black">
        INTERIORS &gt; {project.title?.toUpperCase() || ""}
       </h1>

       {project.description && (
        <div className="max-w-[1164px]">
         <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E]">
          {project.description}
         </p>
        </div>
       )}
      </section>

      {images.length > 0 && (
       <>
        <section className="mt-6 flex w-full flex-col gap-4 xl:hidden">
         {images.map((image, index) => (
          <article key={image._key ?? `${project.title}-${index}`} className="w-full">
           <Image
            src={image.src}
            alt={image.alt || project.title || ""}
            width={image.width}
            height={image.height}
            sizes="100vw"
            className="block h-auto w-full object-cover"
           />
           {index === Math.min(2, images.length - 1) && project.location && (
            <p className="mt-6 whitespace-pre-line font-body md:text-2xl sm:text-xl text-[#2E2E2E]">
             {project.location}
            </p>
           )}
          </article>
         ))}
        </section>

        <section
         className="relative hidden w-full xl:block"
         style={{ height: `${collageHeight}px` }}
        >
         {images.map((image, index) => {
          const groupIndex = Math.floor(index / collagePositions.length);
          const position = collagePositions[index % collagePositions.length];
          const locationIndex = Math.min(2, images.length - 1);
          const top = groupIndex * collageGroupOffset + position.top;

          return (
           <article
            key={image._key ?? `${project.title}-${index}`}
            className="absolute"
            style={{
             top: `${top}px`,
             left: `${position.left}px`,
             width: `${position.width}px`,
             height: `${position.height}px`,
            }}
           >
            <div className="relative h-full w-full bg-[#7F7F7F]">
             <Image
              src={image.src}
              alt={image.alt || project.title || ""}
              fill
              sizes="570px"
              className="object-cover"
             />
            </div>
            {index === locationIndex && project.location && (
             <p className="mt-6 whitespace-pre-line font-body md:text-2xl sm:text-xl text-[#2E2E2E]">
              {project.location}
             </p>
            )}
           </article>
          );
         })}
        </section>
       </>
      )}

      {images.length === 0 && project.location && (
       <p className="whitespace-pre-line font-body md:text-2xl sm:text-xl text-[#2E2E2E]">
        {project.location}
       </p>
      )}
     </div>
    );
   })}

   {projects.length === 0 && (
    <div className="min-h-[50vh] flex items-center justify-center">
     <p className="body-text text-gray-500">No interior projects found.</p>
    </div>
   )}
  </div>
 );
}
