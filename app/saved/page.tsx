'use client'

import { TripProvider, useTrip } from '@/lib/trip-context'
import { Nav } from '@/components/nav'
import { Star, Trash2, MapPin } from 'lucide-react'
import Link from 'next/link'

// Same sample data as map view - in real app would be shared
const SAMPLE_SPOTS = [
  { id: '1', category: 'base', kanji: '家', name: 'Airbnb', location: '10-16 Maruyamachō, Shibuya', lat: 35.6580, lng: 139.6940 },
  { id: '2', category: 'base', kanji: '宿', name: 'Trunk Hotel', location: 'Tokyo Design Forum · Feb 16–18', lat: 35.6614, lng: 139.7081 },
  { id: '3', category: 'culture', kanji: '谷', name: 'Yanaka', location: '20 min · JR to Nippori', lat: 35.7267, lng: 139.7675 },
  { id: '4', category: 'culture', kanji: '神', name: 'Jimbocho', location: '25 min · Hanzōmon Line', lat: 35.6959, lng: 139.7577 },
  { id: '5', category: 'culture', kanji: '下', name: 'Shimokitazawa', location: '15 min · Keio Inokashira Line', lat: 35.6617, lng: 139.6682 },
  { id: '6', category: 'culture', kanji: '浅', name: 'Asakusa', location: '30 min · Ginza Line', lat: 35.7147, lng: 139.7966 },
  { id: '7', category: 'food', kanji: '麺', name: 'Fuunji Ramen', location: 'Shinjuku · Tsukemen', lat: 35.6905, lng: 139.6995 },
  { id: '8', category: 'food', kanji: '寿', name: 'Sushi Dai', location: 'Toyosu Market · 5am queue', lat: 35.6426, lng: 139.7847 },
  { id: '9', category: 'food', kanji: '焼', name: 'Yakitori Alley', location: 'Yurakucho · Under tracks', lat: 35.6750, lng: 139.7619 },
  { id: '10', category: 'food', kanji: '珈', name: 'Onibus Coffee', location: 'Nakameguro · Specialty', lat: 35.6440, lng: 139.6980 },
  { id: '11', category: 'shopping', kanji: '古', name: 'Nakano Broadway', location: 'Anime & vintage collectibles', lat: 35.7058, lng: 139.6655 },
  { id: '12', category: 'shopping', kanji: '本', name: 'Daikanyama T-Site', location: 'Books & lifestyle', lat: 35.6487, lng: 139.7015 },
  { id: '13', category: 'shopping', kanji: '器', name: 'Kappabashi Street', location: 'Kitchen & ceramics', lat: 35.7150, lng: 139.7880 },
  { id: '14', category: 'daytrip', kanji: '鎌', name: 'Kamakura', location: '1hr · JR Yokosuka Line', lat: 35.3192, lng: 139.5467 },
  { id: '15', category: 'daytrip', kanji: '箱', name: 'Hakone', location: '1.5hr · Odakyu Romance Car', lat: 35.2326, lng: 139.1070 },
  { id: '16', category: 'neighborhood', kanji: '渋', name: 'Shibuya', location: 'Scramble crossing', lat: 35.6595, lng: 139.7004 },
  { id: '17', category: 'neighborhood', kanji: '新', name: 'Shinjuku', location: 'Golden Gai & Omoide Yokocho', lat: 35.6938, lng: 139.7034 },
  { id: '18', category: 'neighborhood', kanji: '原', name: 'Harajuku', location: 'Takeshita Street', lat: 35.6702, lng: 139.7027 },
]

const CATEGORY_COLORS: Record<string, string> = {
  base: '#e85d75',
  culture: '#9b7bd4',
  food: '#e8a84d',
  shopping: '#d47bb8',
  daytrip: '#4da8e8',
  neighborhood: '#7bd47b',
}

function SavedContent() {
  const { savedSpots, setSavedSpots } = useTrip()

  const savedItems = SAMPLE_SPOTS.filter(spot => savedSpots.includes(spot.id))

  const removeFromSaved = (spotId: string) => {
    setSavedSpots(savedSpots.filter(id => id !== spotId))
  }

  return (
    <div className="pt-12 min-h-screen bg-background">
      <Nav />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 border-b border-border pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">Saved</h1>
          <p className="text-sm text-muted-foreground font-mono">
            {savedSpots.length} {savedSpots.length === 1 ? 'place' : 'places'} saved
          </p>
        </div>

        {savedItems.length === 0 ? (
          <div className="text-center py-16">
            <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">No saved places yet</h2>
            <p className="text-muted-foreground mb-6">
              Save places from the map to create your personal itinerary
            </p>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-foreground/50 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Explore Map
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {savedItems.map((spot) => (
              <div
                key={spot.id}
                className="flex items-start gap-3 px-4 py-4 border border-border hover:bg-accent/20 transition-colors"
              >
                {/* Category color indicator */}
                <div 
                  className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[spot.category] }}
                />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{spot.kanji}</span>
                    <span className="font-medium text-foreground">{spot.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{spot.location}</p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromSaved(spot.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SavedPage() {
  return (
    <TripProvider>
      <SavedContent />
    </TripProvider>
  )
}
