import type { Metadata } from "next";
import Image from "next/image";
import { getInteriorsPage } from "@/actions/getInteriorsPage";

export const metadata: Metadata = {
 title: "Interiors",
 description:
  "Explore our interior design projects — corporate, hospitality and residential spaces.",
};

export default async function InteriorsPage() {
 const data = await getInteriorsPage();
 const projects = data?.projects || [];

 // Define absolute positions for the 4 collage items based on user's styling,
 // subtracting 433px from the top values to offset for the header/text section length.
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
    return { display: "none" }; // Only 4 grid items layout
  }
 };

 return (
  <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10 lg:pb-80 pt-10 relative">
   {projects.map((project, projectIndex) => (
    <div key={projectIndex} className="mb-40 last:mb-0">
     <section className="mb-[40px]">
      {/* Breadcrumb Heading using project.title */}
      <h1 className="heading-page text-2xl lg:text-5xl md:mb-8 text-black ">
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

     {/* Mobile Layout (stacked) */}
     <section className="xl:hidden flex flex-col gap-8 w-full mt-10 ">
      {[0, 1, 2, 3].map((image: any, index: number) => (
       <article key={index} className="w-full">
        {image?.asset?.url ? (
         <Image
          src={image.asset.url}
          alt={image.alt || project.title || ""}
          width={800}
          height={400}
          className="w-full h-auto object-cover bg-[#7F7F7F]"
         />
        ) : (
         <div className="w-full h-[300px] bg-[#7F7F7F]"></div>
        )}
        {/* Optional Text block below corresponding bottom-left image (index 2) */}
        {index === 2 && (project.title || project.location) && (
         <div className="mt-6">
          {project.title && (
           <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E]">
            {project.title}
           </p>
          )}
          {project.location && (
           <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E] whitespace-pre-line">
            {project.location}
           </p>
          )}
         </div>
        )}
       </article>
      ))}
     </section>

     {/* Desktop Layout (Grid Collage) */}
     <section className="hidden xl:block relative w-full min-h-[1200px]">
      {/* Map 4 images */}
      {[0, 1, 2, 3].map((index) => {
       const style = getStyle(index);
       if (style.display === "none") return null;

       return (
        <article key={index} className="absolute inline-block" style={style}>
         {project.images?.[index]?.asset?.url ? (
          <div className="w-full h-full relative bg-[#7F7F7F]">
           <Image
            src={project.images[index].asset.url}
            alt={project.images[index].alt || project.title || ""}
            fill
            className="object-cover"
           />
          </div>
         ) : (
          <div className="w-full h-[300px] md:h-full bg-[#7F7F7F] block"></div>
         )}

         {/* Optional Text block below corresponding bottom-left image (index 2) */}
         {index === 2 && (project.title || project.location) && (
          <div className="mt-6 w-[570px]">
           {project.location && (
            <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E] whitespace-pre-line">
             {project.location}
            </p>
           )}
          </div>
         )}
        </article>
       );
      })}
     </section>
    </div>
   ))}

   {projects.length === 0 && (
    <div className="min-h-[50vh] flex items-center justify-center">
     <p className="body-text text-gray-500">No interior projects found.</p>
    </div>
   )}
  </div>
 );
}
