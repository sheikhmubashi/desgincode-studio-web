// app/navigation/page.js
import FadeTransition from '@/components/FadeTransition'
import Image from 'next/image'
import Link from 'next/link'

export default function NavigationPage() {
  const navItems = [
    { name: 'NEWS', href: '/news' },
    { name: 'ABOUT US', href: '/about-us' },
    { name: 'ARCHITECTURE', href: '/architecture' },
    { name: 'INTERIORS', href: '/interiors' },
    { name: 'PEOPLE', href: '/people' },
    { name: 'CONTACT US', href: '/contact' }
  ]

  return (
    <FadeTransition>
      <main className="min-h-screen bg-white relative max-w-7xl mx-auto">
        {/* Logo at the top left */}
        <div className="absolute top-8 left-4">
          <Link href="/">
            <Image src={"/logo.svg"} alt='logo' width={60} height={60} className="cursor-pointer" />
          </Link>
        </div>

        {/* Navigation Menu - Left aligned */}
        <div className="flex flex-col justify-center min-h-screen px-4">
          <nav className="space-y-0.5">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group block"
              >
                <span className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black cursor-pointer transition-colors duration-300 hover:text-gray-400">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </main>
    </FadeTransition>
  )
}