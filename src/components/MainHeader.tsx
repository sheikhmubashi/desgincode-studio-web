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
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link transition-opacity duration-200 hover:opacity-50 block py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
