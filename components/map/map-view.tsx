'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useTrip } from '@/lib/trip-context'
import { Star, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// Dynamically import the map to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Sample spots data - in a real app this would come from the database
const SAMPLE_SPOTS = [
  // Base
  { id: '1', category: 'base', kanji: '家', name: 'Airbnb', location: '10-16 Maruyamachō, Shibuya', lat: 35.6580, lng: 139.6940 },
  { id: '2', category: 'base', kanji: '宿', name: 'Trunk Hotel', location: 'Tokyo Design Forum · Feb 16–18', lat: 35.6614, lng: 139.7081 },
  // Culture
  { id: '3', category: 'culture', kanji: '谷', name: 'Yanaka', location: '20 min · JR to Nippori', lat: 35.7267, lng: 139.7675, tier: 1 },
  { id: '4', category: 'culture', kanji: '神', name: 'Jimbocho', location: '25 min · Hanzōmon Line', lat: 35.6959, lng: 139.7577, tier: 1 },
  { id: '5', category: 'culture', kanji: '下', name: 'Shimokitazawa', location: '15 min · Keio Inokashira Line', lat: 35.6617, lng: 139.6682, tier: 1 },
  { id: '6', category: 'culture', kanji: '浅', name: 'Asakusa', location: '30 min · Ginza Line', lat: 35.7147, lng: 139.7966, tier: 2 },
  // Food
  { id: '7', category: 'food', kanji: '麺', name: 'Fuunji Ramen', location: 'Shinjuku · Tsukemen', lat: 35.6905, lng: 139.6995, tier: 1 },
  { id: '8', category: 'food', kanji: '寿', name: 'Sushi Dai', location: 'Toyosu Market · 5am queue', lat: 35.6426, lng: 139.7847, tier: 1 },
  { id: '9', category: 'food', kanji: '焼', name: 'Yakitori Alley', location: 'Yurakucho · Under tracks', lat: 35.6750, lng: 139.7619 },
  { id: '10', category: 'food', kanji: '珈', name: 'Onibus Coffee', location: 'Nakameguro · Specialty', lat: 35.6440, lng: 139.6980 },
  // Shopping
  { id: '11', category: 'shopping', kanji: '古', name: 'Nakano Broadway', location: 'Anime & vintage collectibles', lat: 35.7058, lng: 139.6655, tier: 1 },
  { id: '12', category: 'shopping', kanji: '本', name: 'Daikanyama T-Site', location: 'Books & lifestyle', lat: 35.6487, lng: 139.7015 },
  { id: '13', category: 'shopping', kanji: '器', name: 'Kappabashi Street', location: 'Kitchen & ceramics', lat: 35.7150, lng: 139.7880 },
  // Day trips
  { id: '14', category: 'daytrip', kanji: '鎌', name: 'Kamakura', location: '1hr · JR Yokosuka Line', lat: 35.3192, lng: 139.5467 },
  { id: '15', category: 'daytrip', kanji: '箱', name: 'Hakone', location: '1.5hr · Odakyu Romance Car', lat: 35.2326, lng: 139.1070 },
  // Neighborhoods
  { id: '16', category: 'neighborhood', kanji: '渋', name: 'Shibuya', location: 'Scramble crossing', lat: 35.6595, lng: 139.7004 },
  { id: '17', category: 'neighborhood', kanji: '新', name: 'Shinjuku', location: 'Golden Gai & Omoide Yokocho', lat: 35.6938, lng: 139.7034 },
  { id: '18', category: 'neighborhood', kanji: '原', name: 'Harajuku', location: 'Takeshita Street', lat: 35.6702, lng: 139.7027 },
]

const CATEGORIES = [
  { id: 'all', label: 'All', kanji: '' },
  { id: 'base', label: 'Base', kanji: '基', color: 'var(--color-base)' },
  { id: 'culture', label: 'Culture', kanji: '文', color: 'var(--color-culture)' },
  { id: 'food', label: 'Food', kanji: '食', color: 'var(--color-food)' },
  { id: 'shopping', label: 'Shopping', kanji: '買', color: 'var(--color-shopping)' },
  { id: 'daytrip', label: 'Day Trips', kanji: '日帰り', color: 'var(--color-daytrip)' },
  { id: 'neighborhood', label: 'Neighborhoods', kanji: '近所', color: 'var(--color-neighborhood)' },
]

const CATEGORY_COLORS: Record<string, string> = {
  base: '#e85d75',
  culture: '#9b7bd4',
  food: '#e8a84d',
  shopping: '#d47bb8',
  daytrip: '#4da8e8',
  neighborhood: '#7bd47b',
}

export function MapView() {
  const { savedSpots, setSavedSpots } = useTrip()
  const [activeCategory, setActiveCategory] = useState('all')
  const [visitedSpots, setVisitedSpots] = useState<string[]>([])

  const filteredSpots = useMemo(() => {
    if (activeCategory === 'all') return SAMPLE_SPOTS
    return SAMPLE_SPOTS.filter(spot => spot.category === activeCategory)
  }, [activeCategory])

  const groupedSpots = useMemo(() => {
    const groups: Record<string, typeof SAMPLE_SPOTS> = {}
    filteredSpots.forEach(spot => {
      if (!groups[spot.category]) groups[spot.category] = []
      groups[spot.category].push(spot)
    })
    return groups
  }, [filteredSpots])

  const toggleSaved = (spotId: string) => {
    if (savedSpots.includes(spotId)) {
      setSavedSpots(savedSpots.filter(id => id !== spotId))
    } else {
      setSavedSpots([...savedSpots, spotId])
    }
  }

  const toggleVisited = (spotId: string) => {
    if (visitedSpots.includes(spotId)) {
      setVisitedSpots(visitedSpots.filter(id => id !== spotId))
    } else {
      setVisitedSpots([...visitedSpots, spotId])
    }
  }

  const getCategoryLabel = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId)
    return cat ? `${cat.kanji ? cat.kanji + ' ' : ''}${cat.label}`.toUpperCase() : catId.toUpperCase()
  }

  return (
    <div className="pt-12 h-screen flex flex-col">
      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={[35.6762, 139.6503]}
          zoom={11}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {filteredSpots.map((spot) => (
            <CircleMarker
              key={spot.id}
              center={[spot.lat, spot.lng]}
              radius={8}
              pathOptions={{
                fillColor: CATEGORY_COLORS[spot.category] || '#888',
                fillOpacity: visitedSpots.includes(spot.id) ? 0.4 : 0.9,
                color: visitedSpots.includes(spot.id) ? '#666' : '#fff',
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{spot.kanji} {spot.name}</p>
                  <p className="text-muted-foreground">{spot.location}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Panel */}
      <div className="bg-background border-t border-border">
        {/* Category Filters */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto border-b border-border">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium border transition-colors whitespace-nowrap',
                activeCategory === cat.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground'
              )}
            >
              {cat.kanji && <span className="mr-1">{cat.kanji}</span>}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Spots List */}
        <div className="max-h-[40vh] overflow-y-auto">
          {Object.entries(groupedSpots).map(([category, spots]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="px-4 py-2 text-xs font-mono tracking-wider text-muted-foreground border-b border-border/50">
                {getCategoryLabel(category)}
                <span className="ml-2 text-foreground">{spots.length}</span>
              </div>
              
              {/* Spots */}
              {spots.map((spot) => (
                <button
                  key={spot.id}
                  className={cn(
                    'w-full flex items-start gap-3 px-4 py-3 border-b border-border/30 hover:bg-accent/30 transition-colors text-left',
                    visitedSpots.includes(spot.id) && 'opacity-50'
                  )}
                >
                  {/* Kanji indicator */}
                  <div 
                    className="w-1 h-full min-h-[40px] rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[spot.category] }}
                  />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{spot.kanji}</span>
                      <span className="font-medium text-foreground">{spot.name}</span>
                      {spot.tier && (
                        <span className="text-xs px-1.5 py-0.5 bg-accent text-muted-foreground">
                          Tier {spot.tier}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{spot.location}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaved(spot.id) }}
                      className={cn(
                        'p-2 hover:bg-accent rounded transition-colors',
                        savedSpots.includes(spot.id) ? 'text-yellow-500' : 'text-muted-foreground'
                      )}
                      title="Add to saved"
                    >
                      <Star className="h-4 w-4" fill={savedSpots.includes(spot.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleVisited(spot.id) }}
                      className={cn(
                        'p-2 hover:bg-accent rounded transition-colors',
                        visitedSpots.includes(spot.id) ? 'text-green-500' : 'text-muted-foreground'
                      )}
                      title="Mark as visited"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
