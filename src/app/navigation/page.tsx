// app/navigation/page.js
import FadeTransition from '@/components/FadeTransition'
import Image from 'next/image'
import Link from 'next/link'

export default function NavigationPage() {
  const navItems = [
    { name: 'NEWS', href: '/news' },
    { name: 'ABOUT US', href: '/about' },
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
            <Image src={"/logo.svg"} alt='logo' width={48} height={48} className="cursor-pointer" />
          </Link>
        </div>

        {/* Navigation Menu - Left aligned */}
        <div className="flex flex-col justify-center min-h-screen px-4">
          <nav className="space-y-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group block"
              >
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-black cursor-pointer transition-colors duration-300 hover:text-gray-400">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span><Image src="/facebook_icon.svg" alt='facebook_icon' width={40} height={40} className="cursor-pointer" /></span>
            <span><Image src="/linkedin_icon.svg" alt='linkedin_icon' width={40} height={40} className="cursor-pointer" /></span>
            <span><Image src="/instagram_icon.svg" alt='instagram_icon' width={40} height={40} className="cursor-pointer" /></span>
          </div>
          <div className="text-sm text-gray-400 font-[#898989] mt-2">
            © 2026 Design Code Studio. All Rights Reserved
          </div>
        </div>
      </main>
    </FadeTransition>
  )
}