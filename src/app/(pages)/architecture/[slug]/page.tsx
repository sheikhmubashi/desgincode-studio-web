// app/architecture/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getProjectBySlug } from '@/actions/getProjects'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const result: any = await getProjectBySlug(slug)
  const project = result?.project || result

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: project.title,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const result: any = await getProjectBySlug(slug)
  console.log("Raw result:", result);

  // Handle both nested and direct project data
  const project = result?.project as any || result
  console.log("Processed project:", project);

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 min-h-screen">

      {/* Breadcrumb - ARCHITECTURE > RESIDENCES */}
      <div className="mb-6">
        <p className="font-oswald lg:text-5xl text-2xl font-semibold lg:leading-[71px] mb-8 text-black">
          <Link href="/architecture" className="hover:underline">ARCHITECTURE</Link>
          {' > '}{project.title}
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
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.images.map((image: any, index: number) => (
              <div key={index} className="overflow-hidden">
                <Image
                  src={image.asset.url}
                  alt={image.alt ?? `${project.title} - Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}