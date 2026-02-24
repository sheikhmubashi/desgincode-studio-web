import FadeTransition from '@/components/FadeTransition'
import Image from 'next/image'
import Link from 'next/link'

export default function DesignPage() {
  return (
    <FadeTransition>
      <main className="min-h-screen bg-[#C3D6D4] relative md:px-0 px-4">


        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* DESIGN CODE text */}
          {/* Logo at the top */}
          <div>
            <Link href="/">
              <Image src={"/logo.svg"} alt='logo' width={128} height={120} className="cursor-pointer transition-transform hover:scale-110" />
            </Link>
            <h1 className="text-2xl font-medium text-black mb-8 tracking-wider leading-tight text-center">
              DESIGN CODE
            </h1>
          </div>
          {/* Enter Button */}
          <Link href="/navigation">
            <button className="group cursor-pointer mt-10 bg-white border-0 relative min-w-40 py-2 border-black text-black overflow-hidden transition-all duration-300 hover:bg-black hover:text-white">
              <span className="relative z-10">Enter</span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </Link>
        </div>
      </main>
    </FadeTransition>
  )
}