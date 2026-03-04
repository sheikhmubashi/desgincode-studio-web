'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden relative">
      <div className='max-w-7xl mx-auto overflow-hidden relative min-h-screen'>

        {/* Click Button - Top Left */}
        <Link href="/design">
          <div className="flex items-center mt-6 md:mt-10 ms-6 md:ms-10 gap-2 md:gap-10 cursor-pointer group">
            <Image
              src={"/logo.svg"}
              alt='logo'
              width={40}
              height={40}
              className="md:w-[60px] md:h-[60px] "
            />
            <span className='text-sm md:text-lg font-medium font-serif transition-colors duration-300 group-hover:text-gray-600 font-heading'>{'< Click'}</span>
          </div>
        </Link>

        {/* Mobile Layout - Scaled down scattered letters for mobile */}
        <div className="md:hidden relative w-full h-screen">
          {/* D */}
          <Link href="/design">
            <div className="absolute top-[18%] left-[10%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>D</div>
          </Link>

          {/* E */}
          <Link href="/design">
            <div className="absolute top-[28%] left-[25%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>E</div>
          </Link>

          {/* S */}
          <Link href="/design">
            <div className="absolute top-[38%] left-[15%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>S</div>
          </Link>

          {/* I */}
          <Link href="/design">
            <div className="absolute top-[35%] right-[25%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>I</div>
          </Link>

          {/* G */}
          <Link href="/design">
            <div className="absolute top-[48%] left-[35%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>G</div>
          </Link>

          {/* C */}
          <Link href="/design">
            <div className="absolute top-[52%] right-[20%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>C</div>
          </Link>

          {/* N */}
          <Link href="/design">
            <div className="absolute top-[62%] left-[25%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>N</div>
          </Link>

          {/* O */}
          <Link href="/design">
            <div className="absolute top-[70%] right-[40%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>O</div>
          </Link>

          {/* D */}
          <Link href="/design">
            <div className="absolute top-[82%] left-[15%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>D</div>
          </Link>

          {/* E */}
          <Link href="/design">
            <div className="absolute top-[80%] right-[20%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>E</div>
          </Link>
        </div>

        {/* Desktop Layout - Scattered Typography */}
        <div className="hidden md:block">
          {/* D */}
          <Link href="/design">
            <div className="absolute top-40 left-14 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              D
            </div>
          </Link>

          {/* O */}
          <Link href="/design">
            <div className="absolute top-64 left-14 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              O
            </div>
          </Link>

          {/* G */}
          <Link href="/design">
            <div className="absolute top-72 left-[20%] transform -translate-x-1/2 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              G
            </div>
          </Link>

          {/* S */}
          <Link href="/design">
            <div className="absolute top-[60%] left-14 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              S
            </div>
          </Link>

          {/* E - Center */}
          <Link href="/design">
            <div className="absolute top-1/2 left-[45%] transform -translate-x-1/2 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              C
            </div>
          </Link>

          {/* E - Bottom Left */}
          <Link href="/design">
            <div className="absolute bottom-32 left-1/3 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              E
            </div>
          </Link>

          {/* I */}
          <Link href="/design">
            <div className="absolute top-[38%] right-[40%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              I
            </div>
          </Link>

          {/* E - Top Right */}
          <Link href="/design">
            <div className="absolute top-40 right-72 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              E
            </div>
          </Link>

          {/* N */}
          <Link href="/design">
            <div className="absolute top-2/3 right-1/3 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              N
            </div>
          </Link>

          {/* D - Bottom Right */}
          <Link href="/design">
            <div className="absolute bottom-20 right-16 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              D
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
