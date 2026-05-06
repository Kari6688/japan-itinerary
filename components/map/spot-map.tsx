'use client'

import React, { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import { Activity } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MapPin, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

// Category colors and icons
const CATEGORY_CONFIG = {
  food: { color: '#EF4444', label: 'Food & Dining', icon: '🍜' },
  shopping: { color: '#8B5CF6', label: 'Shopping', icon: '🛍️' },
  sightseeing: { color: '#3B82F6', label: 'Landmarks & Sightseeing', icon: '🗾' },
  accommodation: { color: '#10B981', label: 'Accommodation', icon: '🏨' },
  transport: { color: '#F59E0B', label: 'Transport', icon: '🚄' },
  entertainment: { color: '#EC4899', label: 'Entertainment', icon: '🎭' },
  general: { color: '#6B7280', label: 'General', icon: '📍' },
}

// Create custom markers for each category
const createCustomMarker = (category: string) => {
  const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.general
  
  return L.divIcon({
    html: `<div style="
      background-color: ${config.color};
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
    ">${config.icon}</div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

interface MapProps {
  activities: Activity[]
  onActivitySelect?: (activity: Activity) => void
}

export function SpotMap({ activities, onActivitySelect }: MapProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(Object.keys(CATEGORY_CONFIG))
  )

  // Filter activities by selected categories
  const filteredActivities = useMemo(() => {
    return activities.filter(
      (activity) =>
        activity.latitude &&
        activity.longitude &&
        selectedCategories.has(activity.category)
    )
  }, [activities, selectedCategories])

  // Calculate bounds for all markers
  const bounds = useMemo(() => {
    if (filteredActivities.length === 0) return null
    
    const lats = filteredActivities.map((a) => a.latitude as number)
    const lngs = filteredActivities.map((a) => a.longitude as number)
    
    return [
      [Math.min(...lats) - 0.05, Math.min(...lngs) - 0.05],
      [Math.max(...lats) + 0.05, Math.max(...lngs) + 0.05],
    ] as [[number, number], [number, number]]
  }, [filteredActivities])

  // Center point for map
  const centerPoint: LatLngExpression = useMemo(() => {
    if (filteredActivities.length === 0) {
      return [35.6762, 139.6503] // Default to Tokyo
    }
    
    const avgLat =
      filteredActivities.reduce((sum, a) => sum + (a.latitude || 0), 0) /
      filteredActivities.length
    const avgLng =
      filteredActivities.reduce((sum, a) => sum + (a.longitude || 0), 0) /
      filteredActivities.length
    
    return [avgLat, avgLng]
  }, [filteredActivities])

  const toggleCategory = (category: string) => {
    const newCategories = new Set(selectedCategories)
    if (newCategories.has(category)) {
      newCategories.delete(category)
    } else {
      newCategories.add(category)
    }
    setSelectedCategories(newCategories)
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(new Set(Object.keys(CATEGORY_CONFIG)))
    } else {
      setSelectedCategories(new Set())
    }
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Filter by Category</h3>
          </div>
          
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleAll(selectedCategories.size < Object.keys(CATEGORY_CONFIG).length)}
              className="text-xs"
            >
              {selectedCategories.size === Object.keys(CATEGORY_CONFIG) ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-xs text-muted-foreground flex items-center">
              {filteredActivities.length} spot{filteredActivities.length !== 1 ? 's' : ''} visible
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-colors',
                  selectedCategories.has(key)
                    ? 'border-transparent bg-opacity-10'
                    : 'border-border opacity-50 hover:opacity-75'
                )}
                style={
                  selectedCategories.has(key)
                    ? {
                        backgroundColor: `${config.color}20`,
                        borderColor: config.color,
                      }
                    : {}
                }
              >
                <span>{config.icon}</span>
                <span className="hidden sm:inline">{config.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden">
        {filteredActivities.length > 0 ? (
          <div className="h-96 sm:h-[500px]">
            <MapContainer
              center={centerPoint}
              zoom={12}
              className="h-full w-full"
              bounds={bounds}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredActivities.map((activity) => {
                const config = CATEGORY_CONFIG[activity.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.general
                
                return (
                  <Marker
                    key={activity.id}
                    position={[activity.latitude as number, activity.longitude as number]}
                    icon={createCustomMarker(activity.category)}
                    eventHandlers={{
                      click: () => onActivitySelect?.(activity),
                    }}
                  >
                    <Popup>
                      <div className="w-48 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-foreground">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.location_name}</p>
                          </div>
                          <span className="text-lg">{config.icon}</span>
                        </div>
                        
                        {activity.description && (
                          <p className="text-sm text-foreground">{activity.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {config.label}
                          </Badge>
                          {activity.cost > 0 && (
                            <Badge variant="outline" className="text-xs">
                              ¥{activity.cost.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                        
                        {activity.start_time && (
                          <p className="text-xs text-muted-foreground">
                            ⏰ {activity.start_time}
                            {activity.end_time && ` - ${activity.end_time}`}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        ) : (
          <div className="h-96 sm:h-[500px] flex items-center justify-center bg-muted">
            <div className="text-center space-y-2">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No spots to display</p>
              <p className="text-xs text-muted-foreground">Add activities with locations to see them on the map</p>
            </div>
          </div>
        )}
      </Card>

      {/* Category Legend */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Category Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-full border-2 border-white"
                style={{ backgroundColor: config.color }}
              >
                <div className="h-full w-full flex items-center justify-center text-xs">
                  {config.icon}
                </div>
              </div>
              <span className="text-xs text-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Helper component to handle map bounds
function MapBoundsHandler({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
  const map = useMap()
  
  React.useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [bounds, map])
  
  return null
}
