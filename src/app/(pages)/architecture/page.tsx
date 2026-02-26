import type { Metadata } from 'next'
import Image from 'next/image'
import { getArchitecturePage } from '@/actions/getArchitecturePage'

export const metadata: Metadata = {
  title: 'Architecture',
  description: 'Explore our architectural projects — commercial buildings, residences and more.',
}

export default async function ArchitecturePage() {
  const data = await getArchitecturePage()

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

      <section className="mb-10">
        <h1 className="heading-page mb-5">
          {data?.pageTitle ?? 'Architecture'}
        </h1>

        {data?.heroImage?.asset?.url && (
          <div className="w-full overflow-hidden mb-7">
            <Image
              src={data.heroImage.asset.url}
              alt={data.heroImage.alt ?? 'Architecture'}
              width={1200}
              height={500}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        {data?.intro && (
          <p className="body-text mb-10">{data.intro}</p>
        )}
      </section>

      {/* Projects Grid */}
      {data?.projects && data.projects.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((project, i) => (
              <article key={i} className="group">
                {project.image?.asset?.url && (
                  <div className="overflow-hidden mb-3">
                    <Image
                      src={project.image.asset.url}
                      alt={project.image.alt ?? project.title ?? ''}
                      width={600}
                      height={400}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                {project.title && (
                  <h3 className="heading-page text-[24px] leading-[36px] mb-1">
                    {project.title}
                  </h3>
                )}
                {(project.location || project.year) && (
                  <p className="body-text text-[16px] leading-[24px] text-[#8a8a8a] mb-2">
                    {[project.location, project.year].filter(Boolean).join(' · ')}
                  </p>
                )}
                {project.description && (
                  <p className="body-text text-[18px] leading-[28px]">{project.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
