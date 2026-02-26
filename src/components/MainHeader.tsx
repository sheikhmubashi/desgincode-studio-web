import Image from 'next/image'
import Link from 'next/link'
import { getNavigation } from '@/actions/getNavigation'

// Fallback nav items if Sanity has no data yet
const FALLBACK_NAV = [
  { label: 'NEWS', href: '/news' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'ARCHITECTURE', href: '/architecture' },
  { label: 'INTERIORS', href: '/interiors' },
  { label: 'PEOPLE', href: '/people' },
  { label: 'CONTACT US', href: '/contact-us' },
]

export default async function MainHeader() {
  const nav = await getNavigation()
  const navItems = nav?.navItems?.length ? nav.navItems : FALLBACK_NAV

  return (
    <header className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center h-[150px] gap-10">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="Logo" width={60} height={60} />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link  transition-opacity duration-200 hover:opacity-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  )
}
