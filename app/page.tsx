'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useTrip } from '@/lib/trip-context'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { CheckCircle2, MapPin, ChevronDown, Heart } from 'lucide-react'
import Link from 'next/link'

const MapView = dynamic(() => import('@/components/map/map-view').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <div className="w-full h-80 md:h-96 bg-muted animate-pulse rounded-lg" />
})

const PLANNING_SECTIONS = [
  {
    title: 'Before You Go',
    items: ['Check passport expiration', 'Book flights', 'Reserve hotels', 'Travel insurance', 'Notify bank']
  },
  {
    title: 'Packing',
    items: ['Clothing', 'Toiletries', 'Electronics & chargers', 'Medications', 'Travel documents']
  },
  {
    title: 'Practical Info',
    items: ['Learn basic Japanese phrases', 'Download translation app', 'Get Japan Rail Pass', 'Arrange transportation', 'Check weather forecast']
  },
  {
    title: 'Money & Payments',
    items: ['Notify credit card companies', 'Exchange some currency', 'Learn about IC cards (Suica/Pasmo)', 'Budget by region', 'Find ATMs']
  }
]

export default function HomePage() {
  const { savedCount, savedSpots, setSavedSpots } = useTrip()
  const [expandedSections, setExpandedSections] = useState<string[]>(['Before You Go'])
  
  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const dummySavedSpots = [
    { id: '1', name: 'Senso-ji Temple', location: 'Asakusa', category: 'landmark' },
    { id: '2', name: 'Tsukiji Outer Market', location: 'Chuo', category: 'food' },
    { id: '3', name: 'Takeshita Street', location: 'Shibuya', category: 'shopping' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h1 className="text-lg md:text-xl font-bold text-foreground">Japan 2026</h1>
          </Link>
          <div className="text-xs md:text-sm text-muted-foreground">
            {savedCount > 0 && <span className="font-medium text-primary">{savedCount} saved</span>}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="space-y-5 md:space-y-6">
          
          {/* Map Section */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 px-1">Map</h2>
            <div className="card-section p-0 overflow-hidden h-72 md:h-96 lg:h-[500px]">
              <MapView />
            </div>
          </section>

          {/* Planning Section */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 px-1">Planning</h2>
            <div className="space-y-2">
              {PLANNING_SECTIONS.map((section) => (
                <Collapsible key={section.title} open={expandedSections.includes(section.title)}>
                  <CollapsibleTrigger asChild>
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="card-section w-full flex items-center justify-between hover:bg-muted/50 active:bg-muted"
                    >
                      <span className="font-medium text-foreground text-sm md:text-base">{section.title}</span>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform flex-shrink-0 ${
                          expandedSections.includes(section.title) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 mt-2 pl-4">
                      {section.items.map((item) => (
                        <div key={item} className="flex items-start gap-3 py-2">
                          <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-sm md:text-base text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </section>

          {/* Saved Spots Section */}
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-base md:text-lg font-semibold text-foreground">Saved</h2>
              {savedCount > 0 && (
                <span className="text-xs md:text-sm bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                  {savedCount}
                </span>
              )}
            </div>
            
            {savedCount === 0 ? (
              <div className="card-section text-center py-8 md:py-10">
                <Heart className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-sm md:text-base mb-2 font-medium">No saved spots yet</p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Explore the map and save your favorite locations
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {dummySavedSpots.slice(0, savedCount).map((spot) => (
                  <div key={spot.id} className="card-section flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm md:text-base">{spot.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{spot.location}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSavedSpots(savedSpots.filter(id => id !== spot.id))
                      }}
                      className="p-2 hover:bg-muted rounded transition-colors flex-shrink-0"
                      aria-label="Remove from saved"
                    >
                      <Heart className="h-4 w-4 md:h-5 md:w-5 fill-primary text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Footer Spacing */}
          <div className="h-8" />
        </div>
      </main>
    </div>
  )
}
