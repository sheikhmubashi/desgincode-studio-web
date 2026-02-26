import type { Metadata } from 'next'
import Image from 'next/image'
import { getAboutPage } from '@/actions/getAboutPage'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Founded in 2016, we are an architecture and interior-architecture practice based in Karachi.',
}

export default async function AboutUs() {
  const data = await getAboutPage()

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

      {/* ── ABOUT US ── */}
      <section className="mb-10">
        <h1 className="heading-page mb-5">
          {data?.aboutTitle ?? 'About Us'}
        </h1>

        {/* Hero Banner */}
        <div className="w-full overflow-hidden mb-7">
          <Image
            src={data?.heroImage?.asset?.url ?? '/about_banner_mask.png'}
            alt={data?.heroImage?.alt ?? 'About Us'}
            width={1164}
            height={400}
            className="w-full object-cover"
            priority
          />
        </div>

        {data?.aboutBody && (
          <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E]">{data.aboutBody}</p>
        )}
      </section>

      {/* ── OUR SERVICES ── */}
      <section className="mb-10">
        <h2 className="heading-page mb-4">
          {data?.servicesTitle ?? 'Our Services'}
        </h2>
        {data?.servicesBody && (
          <p className="font-body md:text-2xl sm:text-xl text-[#2E2E2E]">{data.servicesBody}</p>
        )}
      </section>

      {/* ── OUR DESIGN APPROACH ── */}
      <section className="mb-10">
        <h2 className="heading-page mb-4">
          {data?.approachTitle ?? 'Our Design Approach'}
        </h2>
        {data?.approachParagraphs?.map((paragraph, i) => (
          <p key={i} className="font-body md:text-2xl sm:text-xl mb-6 text-[#2E2E2E] last:mb-0">
            {paragraph}
          </p>
        ))}
      </section>

    </div>
  )
}