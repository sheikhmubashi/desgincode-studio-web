import Link from 'next/link'
import Image from 'next/image'
import FadeTransition from '@/components/FadeTransition'

export default function NewsPage() {
  return (
    <FadeTransition>
      <main className="min-h-screen bg-white p-10">
        <Link href="/" className="inline-block mb-10">
          <Image src={"/logo.svg"} alt='logo' width={60} height={60} className="cursor-pointer transition-transform hover:scale-110" />
        </Link>
        <h1 className="text-6xl font-bold">NEWS</h1>
        <p className="text-xl mt-4">Coming soon...</p>
      </main>
    </FadeTransition>
  )
}