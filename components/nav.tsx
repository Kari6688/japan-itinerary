'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTrip } from '@/lib/trip-context'

export function Nav() {
  const pathname = usePathname()
  const { savedCount } = useTrip()

  const links = [
    { href: '/map', label: 'Map' },
    { href: '/planning', label: 'Planning' },
    { href: '/saved', label: `Saved (${savedCount})` },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-border/50">
      {/* Home link with flag */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-7 h-5 bg-white flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#BC002D]" />
        </div>
      </Link>

      {/* Navigation links */}
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors',
              pathname === link.href
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
