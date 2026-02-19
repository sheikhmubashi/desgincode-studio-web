import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100 dark:bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
