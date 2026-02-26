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

      <div className="grid grid-cols-1 gap-12">
        {/* Contact Details */}
        <div className="space-y-6">
          {data?.address && (
            <div>
              <p className="body-text text-[16px] md:text-2xl font-body whitespace-pre-line text-[#2E2E2E]">
                {data.address}
              </p>
            </div>
          )}
          {data?.email && (
            <div>
              <h3 className="heading-page text-[16px] leading-[24px] mb-1 uppercase tracking-wider text-gray-500">
                Email
              </h3>
              <a
                href={`mailto:${data.email}`}
                className="body-text text-[16px] leading-[24px] hover:opacity-60 transition-opacity text-gray-700"
              >
                {data.email}
              </a>
            </div>
          )}
          {data?.phone && (
            <div>
              <h3 className="heading-page text-[16px] leading-[24px] mb-1 uppercase tracking-wider text-gray-500">
                Phone
              </h3>
              <a
                href={`tel:${data.phone}`}
                className="body-text text-[16px] leading-[24px] hover:opacity-60 transition-opacity text-gray-700"
              >
                {data.phone}
              </a>
            </div>
          )}
        </div>

        {/* Google Map - Exactly like screenshot */}
        <div className="w-full">
          {data?.mapEmbedUrl ? (
            <iframe
              src={data.mapEmbedUrl}
              width="100%"
              height="500"
              style={{
                border: 0,
                width: '100%',
                height: '500px',
                filter: 'grayscale(100%)'
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Google Maps API</p>
            </div>
          )}

          {/* Google Maps Attribution */}
          <div className="text-xs text-gray-400 mt-1 text-right">
            Google Maps API
          </div>
        </div>
      </div>
    </div>
  )
}