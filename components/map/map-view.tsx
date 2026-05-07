'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useTrip } from '@/lib/trip-context'
import { Star, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Dynamically import Leaflet components with no SSR
const DynamicMap = dynamic(
  () => import('./leaflet-map'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted flex items-center justify-center">Loading map...</div>
  }
)

const SAMPLE_SPOTS = [
  { id: '1', category: 'base', name: 'Airbnb', location: 'Shibuya', lat: 35.6580, lng: 139.6940 },
  { id: '2', category: 'culture', name: 'Yanaka', location: 'Taito', lat: 35.7267, lng: 139.7675 },
  { id: '3', category: 'culture', name: 'Asakusa', location: 'Taito', lat: 35.7147, lng: 139.7966 },
  { id: '4', category: 'food', name: 'Fuunji Ramen', location: 'Shinjuku', lat: 35.6905, lng: 139.6995 },
  { id: '5', category: 'food', name: 'Sushi Dai', location: 'Chuo', lat: 35.6426, lng: 139.7847 },
  { id: '6', category: 'shopping', name: 'Nakano Broadway', location: 'Nakano', lat: 35.7058, lng: 139.6655 },
  { id: '7', category: 'shopping', name: 'Harajuku', location: 'Shibuya', lat: 35.6702, lng: 139.7027 },
  { id: '8', category: 'landmark', name: 'Senso-ji Temple', location: 'Asakusa', lat: 35.7151, lng: 139.7964 },
  { id: '9', category: 'landmark', name: 'Meiji Shrine', location: 'Shibuya', lat: 35.6761, lng: 139.6989 },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'base', label: 'Base' },
  { id: 'culture', label: 'Culture' },
  { id: 'food', label: 'Food' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'landmark', label: 'Landmarks' },
]

const CATEGORY_COLORS: Record<string, string> = {
  base: '#ef4444',
  culture: '#8b5cf6',
  food: '#f59e0b',
  shopping: '#ec4899',
  landmark: '#3b82f6',
}

export function MapView() {
  const { savedSpots, setSavedSpots } = useTrip()
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredSpots = useMemo(() => {
    if (activeCategory === 'all') return SAMPLE_SPOTS
    return SAMPLE_SPOTS.filter(spot => spot.category === activeCategory)
  }, [activeCategory])

  const toggleSaved = (spotId: string) => {
    setSavedSpots(
      savedSpots.includes(spotId)
        ? savedSpots.filter(id => id !== spotId)
        : [...savedSpots, spotId]
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <DynamicMap
          spots={filteredSpots}
          categoryColors={CATEGORY_COLORS}
          savedSpots={savedSpots}
          onSaveSpot={toggleSaved}
        />
      </div>

      {/* Category Filters - Mobile Optimized */}
      <div className="border-t border-border bg-card">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-3 py-1.5 text-xs md:text-sm font-medium rounded transition-colors whitespace-nowrap',
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-border'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
