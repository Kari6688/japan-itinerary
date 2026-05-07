'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

interface LeafletMapProps {
  spots: Array<{ id: string; category: string; name: string; location: string; lat: number; lng: number }>
  categoryColors: Record<string, string>
  savedSpots: string[]
  onSaveSpot: (spotId: string) => void
}

export default function LeafletMap({ spots, categoryColors, savedSpots, onSaveSpot }: LeafletMapProps) {
  return (
    <MapContainer
      center={[35.6762, 139.6503]}
      zoom={11}
      className="h-full w-full"
      zoomControl={true}
      dragging={true}
      touchZoom={true}
      doubleClickZoom={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {spots.map((spot) => (
        <CircleMarker
          key={spot.id}
          center={[spot.lat, spot.lng]}
          radius={6}
          pathOptions={{
            fillColor: categoryColors[spot.category] || '#888',
            fillOpacity: 0.8,
            color: '#fff',
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-xs md:text-sm space-y-1">
              <p className="font-bold">{spot.name}</p>
              <p className="text-muted-foreground text-xs">{spot.location}</p>
              <button
                onClick={() => onSaveSpot(spot.id)}
                className={`text-xs font-medium ${
                  savedSpots.includes(spot.id) ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {savedSpots.includes(spot.id) ? '★ Saved' : '☆ Save'}
              </button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
