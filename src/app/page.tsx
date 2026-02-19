import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="relative min-h-screen bg-white dark:bg-black flex items-center">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Badge */}
          <span className="inline-block rounded-full border px-4 py-1 text-sm text-muted-foreground">
            Modern Web Development Studio
          </span>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Build. Scale. Ship.
            <br />
            <span className="text-primary">DesginCode</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            DesginCode builds high-performance web applications using
            Next.js, Sanity CMS, and scalable SaaS architecture —
            engineered for speed, clarity, and growth.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/about">
              <Button size="lg">
                Learn More
              </Button>
            </Link>

            <Link href="/studio">
              <Button size="lg" variant="outline">
                Open CMS
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Subtle Divider */}
        <div className="mt-24 border-t pt-10 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DesginCode. All rights reserved.
        </div>
      </div>
    </section>
  );
}
