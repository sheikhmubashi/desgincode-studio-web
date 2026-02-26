import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getNewsPosts } from '@/actions/getNewsPosts'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and updates from Design Code Studio.',
}

export default async function NewsPage() {
  const posts = await getNewsPosts()

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

      <section className="mb-10">
        <h1 className="heading-page mb-5">News</h1>
      </section>

      {posts.length === 0 ? (
        <p className="body-text text-[#8a8a8a]">No news articles yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/news/${post.slug?.current ?? post._id}`}
              className="group block"
            >
              {post.heroImage?.asset?.url && (
                <div className="overflow-hidden mb-4">
                  <Image
                    src={post.heroImage.asset.url}
                    alt={post.heroImage.alt ?? post.title ?? ''}
                    width={600}
                    height={400}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              {post.category && (
                <span className="body-text text-[12px] leading-[20px] uppercase text-[#8a8a8a] tracking-widest mb-1 block">
                  {post.category}
                </span>
              )}

              <h2 className="heading-page text-[22px] leading-[32px] mb-2 group-hover:opacity-60 transition-opacity">
                {post.title}
              </h2>

              {post.publishedAt && (
                <p className="body-text text-[14px] leading-[22px] text-[#8a8a8a] mb-3">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}

              {post.excerpt && (
                <p className="body-text text-[16px] leading-[26px] line-clamp-3">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}

    </div>
  )
}
