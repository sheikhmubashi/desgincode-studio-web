import type { Metadata } from "next";
import Image from "next/image";
import { getPeoplePage } from "@/actions/getPeoplePage";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
 title: "People",
 description: "Meet the team behind Design Code Studio.",
};

export default async function PeoplePage() {
 const data = await getPeoplePage();

 return (
  <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-10 lg:pb-20">
   {/* Team Members */}
   {data?.team && data.team.length > 0 && (
    <section>
     <div className="space-y-20">
      {data.team.map((member, i) => (
       <div
        key={i}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-start"
       >
        {/* Text Content - Left Side - Increased width */}
        <div className="flex flex-col lg:w-[766px] w-full">
         {/* Role - First as in screenshot */}
         {member.role && (
          <h2 className="heading-page text-2xl lg:text-5xl mb-1">
           {member.role}
          </h2>
         )}

         {/* Name */}
         {member.name && (
          <h1 className="md:text-[30px] text-xl text-[#2E2E2E] font-light tracking-wide mb-6">
           {member.name}
          </h1>
         )}

         {/* Biography */}
         {member.bio && (
          <div className="font-body md:text-2xl sm:text-xl text-[#2E2E2E]">
           {member.bio.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="mb-4 last:mb-0">
             {paragraph}
            </p>
           ))}
          </div>
         )}
        </div>

        {/* Image - Right Side - Full right alignment */}
        {member.image?.asset?.url && (
         <div className="order-1 lg:order-2 flex justify-end">
          <div className="overflow-hidden w-[372px] h-[314px] lg:w-auto lg:h-auto lg:max-w-full">
           <Image
            src={urlFor(member.image).url()}
            alt={member.image.alt ?? member.name ?? ""}
            width={600}
            height={450}
            className="w-full object-cover"
           />
          </div>
         </div>
        )}
       </div>
      ))}
     </div>
    </section>
   )}
  </div>
 );
}
