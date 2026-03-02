'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden relative">
      <div className='max-w-7xl mx-auto overflow-hidden relative min-h-screen'>

        {/* Click Button - Top Left */}
        <Link href="/design">
          <div className="flex items-center mt-6 md:mt-10 ms-6 md:ms-10 gap-6 md:gap-10 cursor-pointer group">
            <Image
              src={"/logo.svg"}
              alt='logo'
              width={40}
              height={40}
              className="md:w-[60px] md:h-[60px] "
            />
            <span className='text-sm md:text-lg font-medium font-serif transition-colors duration-300 group-hover:text-gray-600'>{'< Click'}</span>
          </div>
        </Link>

        {/* Mobile Layout - Scaled down scattered letters for mobile */}
        <div className="md:hidden relative w-full h-screen">
          {/* D - Top Left */}
          <Link href="/design">
            <div className="absolute top-20 left-6 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>D</div>
          </Link>

          {/* E */}
          <Link href="/design">
            <div className="absolute top-40 left-12 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>E</div>
          </Link>

          {/* S */}
          <Link href="/design">
            <div className="absolute top-56 left-8 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>S</div>
          </Link>

          {/* I */}
          <Link href="/design">
            <div className="absolute top-64 right-20 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>I</div>
          </Link>

          {/* G */}
          <Link href="/design">
            <div className="absolute top-72 left-1/3 transform -translate-x-1/2 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>G</div>
          </Link>

          {/* N */}
          <Link href="/design">
            <div className="absolute top-80 left-16 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>N</div>
          </Link>

          {/* I - Right side */}
          <Link href="/design">
            <div className="absolute top-96 right-16 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>I</div>
          </Link>

          {/* E - Right side lower */}
          <Link href="/design">
            <div className="absolute bottom-40 right-12 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>E</div>
          </Link>

          {/* D - Bottom */}
          <Link href="/design">
            <div className="absolute bottom-24 left-12 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-125 cursor-pointer" style={{ fontSize: '32px' }}>D</div>
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
              E
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
