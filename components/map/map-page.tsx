'use client'

import { useEffect, useState } from 'react'
import { useTrip } from '@/lib/trip-context'
import { Activity } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import SpotMap with SSR disabled since Leaflet requires window
const SpotMap = dynamic(
  () => import('@/components/map/spot-map').then((mod) => mod.SpotMap),
  { 
    ssr: false,
    loading: () => (
      <Card className="h-96 sm:h-[500px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-8 rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </Card>
    )
  }
)

export function MapPage() {
  const { trip } = useTrip()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchActivities = async () => {
      if (!trip?.id) {
        setLoading(false)
        return
      }

      try {
        // Fetch all days for this trip
        const { data: days, error: daysError } = await supabase
          .from('days')
          .select('id')
          .eq('trip_id', trip.id)

        if (daysError) throw daysError

        // Fetch all activities for those days
        if (days && days.length > 0) {
          const dayIds = days.map((d) => d.id)
          const { data: activitiesData, error: activitiesError } = await supabase
            .from('activities')
            .select('*')
            .in('day_id', dayIds)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null)
            .order('created_at', { ascending: false })

          if (activitiesError) throw activitiesError

          setActivities(activitiesData || [])
        }
      } catch (error) {
        console.error('[v0] Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [trip?.id, supabase])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Trip Map</h1>
        </div>
        <p className="text-muted-foreground">
          Explore all your activities and spots organized by category across your trip to Japan.
        </p>
      </div>

      {/* Stats Cards */}
      {!loading && activities.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{activities.length}</div>
            <div className="text-xs text-muted-foreground">Total Spots</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(activities.map((a) => a.category)).size}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {activities
                .reduce((sum, a) => sum + (a.cost || 0), 0)
                .toLocaleString()}{' '}
              JPY
            </div>
            <div className="text-xs text-muted-foreground">Total Cost</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(activities.map((a) => a.day_id)).size}
            </div>
            <div className="text-xs text-muted-foreground">Days Covered</div>
          </Card>
        </div>
      )}

      {/* Map Component */}
      {loading ? (
        <Card className="p-4 space-y-4">
          <Skeleton className="h-96" />
        </Card>
      ) : (
        <SpotMap activities={activities} onActivitySelect={setSelectedActivity} />
      )}

      {/* Selected Activity Details */}
      {selectedActivity && (
        <Card className="p-6 border-primary/50 bg-card">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedActivity.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedActivity.location_name}</p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                X
              </button>
            </div>

            {selectedActivity.description && (
              <p className="text-foreground">{selectedActivity.description}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {selectedActivity.category && (
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-semibold text-foreground capitalize">{selectedActivity.category}</p>
                </div>
              )}
              
              {selectedActivity.start_time && (
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-semibold text-foreground">
                    {selectedActivity.start_time}
                    {selectedActivity.end_time && ` - ${selectedActivity.end_time}`}
                  </p>
                </div>
              )}

              {selectedActivity.cost > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-semibold text-foreground">
                    {selectedActivity.cost.toLocaleString()} JPY
                  </p>
                </div>
              )}

              {selectedActivity.latitude && selectedActivity.longitude && (
                <div>
                  <p className="text-xs text-muted-foreground">Coordinates</p>
                  <p className="font-mono text-xs text-foreground">
                    {selectedActivity.latitude.toFixed(4)}, {selectedActivity.longitude.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && activities.length === 0 && (
        <Card className="p-12 text-center space-y-3">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No Spots Yet</h3>
          <p className="text-muted-foreground">
            Add activities with location information to see them on the map.
          </p>
        </Card>
      )}
    </div>
  )
}
