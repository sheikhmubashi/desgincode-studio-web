"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/sanity/lib/image";

type GalleryImage = {
 asset: SanityImageSource | null;
 alt?: string | null;
 _key?: string;
};

export type ArchitectureGalleryGroup = {
 key: string;
 title: string;
 description?: string | null;
 images: GalleryImage[] | null;
 showTitle?: boolean;
};

type GalleryPhoto = {
 key: string;
 src: string;
 alt: string;
 groupTitle: string;
};

export default function ArchitectureGallery({
 groups,
}: {
 groups: ArchitectureGalleryGroup[];
}) {
 const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

 const photos: GalleryPhoto[] = groups.flatMap((group) =>
  (group.images ?? []).flatMap((image, imageIndex) => {
   if (!image?.asset) return [];
   return [
    {
     key: image._key || `${group.key}-${imageIndex}`,
     src: urlFor(image.asset).url(),
     alt: image.alt || group.title || "",
     groupTitle: group.title,
    },
   ];
  }),
 );

 return (
  <div>
   {groups.map((group, groupIndex) => (
    <section key={group.key} className={groupIndex > 0 ? "mt-16" : undefined}>
     {group.showTitle && group.title && (
      <h2 className="heading-page text-3xl text-black md:text-5xl [text-transform:none]">
       {group.title}
      </h2>
     )}
     {group.description && (
      <p className="font-body mt-4 w-full text-lg text-[#2E2E2E] sm:text-xl md:text-2xl">
       {group.description}
      </p>
     )}
     {group.images && group.images.length > 0 && (
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
       {group.images.map((image, imageIndex) => {
        if (!image?.asset) return null;
        const key = image._key || `${group.key}-${imageIndex}`;
        const photoIndex = photos.findIndex((photo) => photo.key === key);
        const src = urlFor(image.asset).url();

        return (
         <button
          key={key}
          type="button"
          onClick={() => setActivePhotoIndex(photoIndex)}
          aria-label={`Enlarge image ${imageIndex + 1} of ${group.title}`}
          className="group relative aspect-[4/3] overflow-hidden bg-[#2E2E2E]/5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E2E2E]"
         >
          <Image
           src={src}
           alt={image.alt || group.title || ""}
           fill
           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
           className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
         </button>
        );
       })}
      </div>
     )}
    </section>
   ))}

   {activePhotoIndex !== null && photos[activePhotoIndex] && (
    <div
     className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
     role="dialog"
     aria-modal="true"
     aria-label={`${photos[activePhotoIndex].groupTitle} gallery`}
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
       {photos[activePhotoIndex].groupTitle} · {activePhotoIndex + 1} /{" "}
       {photos.length}
      </p>
     </div>
     <button
      type="button"
      onClick={() =>
       setActivePhotoIndex((activePhotoIndex + 1) % photos.length)
      }
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
