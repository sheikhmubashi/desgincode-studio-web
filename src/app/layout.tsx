import type { Metadata } from 'next'
import { Oswald } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})


export const metadata: Metadata = {
  metadataBase: new URL("https://desgincode.com"),
  title: {
    default: "DesginCode — Modern Web Development & UI Engineering",
    template: "%s | DesginCode",
  },
  description:
    "DesginCode is a modern web development studio building scalable Next.js, Sanity, and SaaS applications with clean UI and performance-first architecture.",
  keywords: [
    "DesginCode",
    "Next.js Development",
    "Sanity CMS",
    "SaaS Development",
    "UI Engineering",
  ],
  authors: [{ name: "DesginCode Team" }],
  openGraph: {
    title: "DesginCode — Modern Web Development Studio",
    description:
      "Building high-performance modern web applications using Next.js, Sanity, and Tailwind.",
    url: "https://desgincode.com",
    siteName: "DesginCode",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DesginCode",
    description:
      "Modern Next.js + Sanity powered applications built for scale.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oswald.variable} antialiased`} style={{ fontFamily: 'var(--font-oswald), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
