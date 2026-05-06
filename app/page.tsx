'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TripProvider, useTrip } from '@/lib/trip-context'

function HomeContent() {
  const { savedCount } = useTrip()

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Japanese text on left side */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 writing-vertical text-muted-foreground/20 text-3xl tracking-[0.3em] font-light select-none hidden lg:block">
        日本のフィールドガイド
      </div>
      
      {/* Japanese text on right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 writing-vertical text-muted-foreground/20 text-3xl tracking-[0.3em] font-light select-none hidden lg:block">
        東京2026年
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Japan Flag */}
        <div className="mb-10">
          <div className="w-36 h-24 bg-white flex items-center justify-center shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="w-12 h-12 rounded-full bg-[#BC002D]" />
          </div>
        </div>

        {/* Japanese Title */}
        <p className="text-muted-foreground/60 text-sm tracking-[0.2em] mb-2">日本のフィールドガイド</p>
        <p className="text-muted-foreground/40 text-xs tracking-[0.15em] mb-6">東京2026年2月</p>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-center tracking-tight">
          日本のフィールドガイド
        </h1>
        <p className="text-muted-foreground text-base mb-1 font-sans">Japan Field Guide</p>
        <p className="text-muted-foreground/60 text-sm font-mono tracking-widest uppercase mb-16">
          Tokyo &middot; Feb 12–20, 2026
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-4 justify-center">
          <Link 
            href="/map" 
            className="group flex items-center justify-between px-6 py-4 border border-border hover:border-foreground/40 transition-all duration-300 min-w-[160px] bg-transparent"
          >
            <span className="text-foreground font-medium">Map</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/planning" 
            className="group flex items-center justify-between px-6 py-4 border border-border hover:border-foreground/40 transition-all duration-300 min-w-[160px] bg-transparent"
          >
            <span className="text-foreground font-medium">Planning</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/saved" 
            className="group flex items-center justify-between px-6 py-4 border border-border hover:border-foreground/40 transition-all duration-300 min-w-[160px] bg-transparent"
          >
            <span className="text-foreground font-medium">Saved</span>
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-sm">{savedCount}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-muted-foreground/40 text-xs font-mono tracking-wide">
          Built with v0 &middot; 2026
        </p>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <TripProvider>
      <HomeContent />
    </TripProvider>
  )
}
