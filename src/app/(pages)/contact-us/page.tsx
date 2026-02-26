import type { Metadata } from 'next'
import { getContactPage } from '@/actions/getContactPage'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Design Code Studio.',
}

export default async function ContactUsPage() {
  const data = await getContactPage()

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

      <section className="mb-6">
        <h1 className="heading-page mb-5">
          {data?.pageTitle ?? 'Contact Us'}
        </h1>
        {data?.intro && (
          <p className="body-text mb-10">{data.intro}</p>
        )}
      </section>

      {/* Banner Image - Now after the heading */}
      {data?.bannerImage && (
        <div className="relative w-full h-[300px] md:h-[400px] mb-10">
          <Image
            src={urlFor(data.bannerImage).url()}
            alt={data.bannerImage.alt || 'Contact Us Banner'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Details */}
        <div className="space-y-6">
          {data?.address && (
            <div>
              <p className="body-text text-[18px] leading-[28px] whitespace-pre-line">{data.address}</p>
            </div>
          )}
          {data?.email && (
            <div>
              <h3 className="heading-page text-[20px] leading-[30px] mb-1">Email</h3>
              <a
                href={`mailto:${data.email}`}
                className="body-text text-[18px] leading-[28px] hover:opacity-60 transition-opacity"
              >
                {data.email}
              </a>
            </div>
          )}
          {data?.phone && (
            <div>
              <h3 className="heading-page text-[20px] leading-[30px] mb-1">Phone</h3>
              <a
                href={`tel:${data.phone}`}
                className="body-text text-[18px] leading-[28px] hover:opacity-60 transition-opacity"
              >
                {data.phone}
              </a>
            </div>
          )}
        </div>

        {/* Google Map */}
        <div>
          {data?.mapEmbedUrl && (
            <iframe
              src={data.mapEmbedUrl}
              width="100%"
              height="400"
              className="border-0 w-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
    </div>
  )
}