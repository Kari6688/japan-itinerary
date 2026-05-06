'use client'

import { TripProvider } from '@/lib/trip-context'
import { Nav } from '@/components/nav'
import { MapView } from '@/components/map/map-view'

export default function MapPage() {
  return (
    <TripProvider>
      <div className="min-h-screen bg-background">
        <Nav />
        <MapView />
      </div>
    </TripProvider>
  )
}
