'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

// Fallback nav items if Sanity has no data yet
const FALLBACK_NAV = [
  { label: 'NEWS', href: '/news' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'ARCHITECTURE', href: '/architecture' },
  { label: 'INTERIORS', href: '/interiors' },
  { label: 'PEOPLE', href: '/people' },
  { label: 'CONTACT US', href: '/contact-us' },
]

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navItems = FALLBACK_NAV

  return (
    <header className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-[150px] gap-10">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="lg:w-[60px] lg:h-[60px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`lg:hidden border-t border-gray-200 absolute w-full left-0 bg-white z-50 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-dvh opacity-100 min-h-dvh' : 'max-h-0 opacity-0 min-h-0'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link transition-all duration-300 hover:opacity-50 block leading-none ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                }`}
              style={{ transitionDelay: isMenuOpen ? '100ms' : '0ms' }}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
