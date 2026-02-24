import FadeTransition from '@/components/FadeTransition'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <FadeTransition>
      <main className="min-h-screen bg-white overflow-hidden relative">
        <div className='max-w-7xl mx-auto overflow-hidden relative min-h-screen'>

          {/* Click Button - Top Left */}
          <Link href="/design">
            <div className="flex items-center mt-10 ms-10 gap-10 cursor-pointer group">
              <Image src={"/logo.svg"} alt='logo' width={60} height={60} className="transition-transform duration-300 group-hover:scale-110" />
              <span className='md:text-lg font-medium font-serif transition-colors duration-300 group-hover:text-gray-600'>{'< Click'}</span>
            </div>
          </Link>

          {/* Scattered Typography - "DESIGN" letters with hover effects */}
          <Link href="/design">
            <div className="absolute top-40 left-14 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              D
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute top-64 left-14 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              O
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute top-72 left-[20%] transform -translate-x-1/2 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              G
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute top-[60%] left-14 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              S
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute top-1/2 left-[45%] transform -translate-x-1/2 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              E
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute bottom-32 left-1/3 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              E
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute top-[38%] right-[40%] font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              I
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute top-40 right-72 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              E
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute top-2/3 right-1/3 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              N
            </div>
          </Link>

          <Link href="/design">
            <div className="absolute bottom-20 right-16 font-semibold text-black select-none leading-none transition-transform duration-300 hover:scale-150 cursor-pointer" style={{ fontSize: '50px' }}>
              D
            </div>
          </Link>
        </div>
      </main>
    </FadeTransition>
  )
}