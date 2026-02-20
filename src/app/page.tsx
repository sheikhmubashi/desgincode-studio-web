
import Image from 'next/image'
import Link from 'next/link'
export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden relative">
      <div className='max-w-7xl mx-auto overflow-hidden relative min-h-screen'>

        {/* Click Button - Top Left */}
        <Link href={"/"}>
          <div className="flex items-center mt-10 ms-10 gap-10">
            <Image src={"/logo.svg"} alt='logo' width={60} height={60} />
            <span className='md:text-lg font-medium font-serif'>{'< Click'}</span>

          </div>
        </Link>

        {/* Scattered Typography - "DESIGN" letters */}

        {/* D - top left, very large */}
        <div className="absolute top-40 left-14 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          D
        </div>

        {/* O - left side, below D */}
        <div className="absolute top-64 left-14 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          O
        </div>

        {/* G - upper-middle area */}
        <div className="absolute top-72 left-[20%] transform -translate-x-1/2 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          G
        </div>

        {/* S - left side, middle */}
        <div className="absolute top-[60%] left-14 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          S
        </div>

        {/* E - center area, middle */}
        <div className="absolute top-1/2 left-[45%] transform -translate-x-1/2 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          E
        </div>

        {/* E - bottom center, lower */}
        <div className="absolute bottom-32 left-1/3 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          E
        </div>

        {/* I - right side, upper-middle */}
        <div className="absolute top-[38%] right-[40%] font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          I
        </div>

        {/* E - top right area */}
        <div className="absolute top-40 right-72 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          E
        </div>

        {/* N - right side, middle-lower */}
        <div className="absolute top-2/3 right-1/3 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          N
        </div>

        {/* D - bottom right */}
        <div className="absolute bottom-20 right-16 font-semibold text-black select-none leading-none" style={{ fontSize: '50px' }}>
          D
        </div>
      </div>

    </main>
  )
}
