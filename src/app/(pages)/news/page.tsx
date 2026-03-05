import type { Metadata } from "next";
import { getNewsPosts } from "@/actions/getNewsPosts";

export const metadata: Metadata = {
 title: "News",
 description: "Latest news and updates from Design Code Studio.",
};

export default async function NewsPage() {
 const posts = await getNewsPosts();

 return (
  <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10 pb-20 flex min-h-screen">
   {/* Main Container - Left aligned like image */}
   <div className="flex-1">
    {posts.length === 0 ? (
     <p className="body-text text-[#8a8a8a]">
      No news articles yet. Check back soon.
     </p>
    ) : (
     <div className="flex flex-col gap-6 lg:gap-12">
      {posts.map((post) => (
       <article key={post._id} className="w-full">
        {/* Title: 48px Oswald uppercase (using heading-page) */}
        <h2 className="heading-page text-2xl lg:text-5xl  lg:mb-6 text-black hover:opacity-70 transition-opacity uppercase">
         {post.title}
        </h2>

        {/* Content: 24px/32px Roboto Condensed (using body-text) */}
        {post.content && (
         <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E]">
          {post.content}
         </p>
        )}
       </article>
      ))}
     </div>
    )}
   </div>
  </div>
 );
}
