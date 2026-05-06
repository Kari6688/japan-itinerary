'use client'

import { useEffect, useState } from 'react'
import { useTrip } from '@/lib/trip-context'
import { createClient } from '@/lib/supabase/client'
import { Day, Activity } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Plus, Clock, MapPin, Trash2, Edit2 } from 'lucide-react'
import { formatDate } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ActivityForm } from './activity-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LogIn, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const CATEGORY_COLORS = {
  food: 'bg-red-100 text-red-800',
  shopping: 'bg-purple-100 text-purple-800',
  sightseeing: 'bg-blue-100 text-blue-800',
  accommodation: 'bg-green-100 text-green-800',
  transport: 'bg-orange-100 text-orange-800',
  entertainment: 'bg-pink-100 text-pink-800',
  general: 'bg-gray-100 text-gray-800',
}

export function DailyItineraryView() {
  const { trip, isGuest, user } = useTrip()
  const [days, setDays] = useState<(Day & { activities: Activity[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<Day | null>(null)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [isAddingDay, setIsAddingDay] = useState(false)
  const [newDayDate, setNewDayDate] = useState('')
  const supabase = createClient()

  // Fetch days and activities
  useEffect(() => {
    const fetchDays = async () => {
      if (!trip?.id) {
        setLoading(false)
        return
      }

      try {
        const { data: daysData, error: daysError } = await supabase
          .from('days')
          .select('*')
          .eq('trip_id', trip.id)
          .order('date', { ascending: true })

        if (daysError) throw daysError

        // Fetch activities for each day
        const daysWithActivities = await Promise.all(
          (daysData || []).map(async (day) => {
            const { data: activities, error } = await supabase
              .from('activities')
              .select('*')
              .eq('day_id', day.id)
              .order('order_index', { ascending: true })

            if (error) throw error
            return { ...day, activities: activities || [] }
          })
        )

        setDays(daysWithActivities)
      } catch (error) {
        console.error('[v0] Error fetching days:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDays()
  }, [trip?.id, supabase])

  const handleAddDay = async () => {
    if (!trip?.id || !newDayDate) return

    try {
      const { data, error } = await supabase
        .from('days')
        .insert({
          trip_id: trip.id,
          date: newDayDate,
          title: `Day ${days.length + 1}`,
        })
        .select()

      if (error) throw error

      if (data) {
        setDays([...days, { ...data[0], activities: [] }])
        setNewDayDate('')
        setIsAddingDay(false)
      }
    } catch (error) {
      console.error('[v0] Error adding day:', error)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const { error } = await supabase.from('activities').delete().eq('id', activityId)

      if (error) throw error

      setDays(
        days.map((day) => ({
          ...day,
          activities: day.activities.filter((a) => a.id !== activityId),
        }))
      )
    } catch (error) {
      console.error('[v0] Error deleting activity:', error)
    }
  }

  const handleActivitySaved = (newActivity: Activity) => {
    setDays(
      days.map((day) => {
        if (day.id === newActivity.day_id) {
          const existingIndex = day.activities.findIndex((a) => a.id === newActivity.id)
          if (existingIndex >= 0) {
            // Update existing
            day.activities[existingIndex] = newActivity
          } else {
            // Add new
            day.activities.push(newActivity)
          }
        }
        return day
      })
    )
    setEditingActivity(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Guest Warning */}
      {isGuest && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sign in to save your trip</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            <span>Your changes won&apos;t be saved until you sign in.</span>
            <Link href="/auth/login" className="text-primary underline hover:no-underline font-medium">
              Sign in
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Daily Itinerary</h1>
          </div>
          <Dialog open={isAddingDay} onOpenChange={setIsAddingDay}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={isGuest}>
                <Plus className="h-4 w-4" />
                Add Day
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Day</DialogTitle>
                <DialogDescription>Add a new day to your trip itinerary.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <Input
                    type="date"
                    value={newDayDate}
                    onChange={(e) => setNewDayDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAddingDay(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDay} disabled={!newDayDate}>
                    Add Day
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">
          {days.length} day{days.length !== 1 ? 's' : ''} planned • {days.reduce((sum, d) => sum + d.activities.length, 0)} activities
        </p>
      </div>

      {/* Days View */}
      {days.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No Days Yet</h3>
          <p className="text-muted-foreground">Start planning by adding your first day to the trip.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {days.map((day, dayIndex) => (
            <Card key={day.id} className="overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4">
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {dayIndex + 1}
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {day.title || `Day ${dayIndex + 1}`}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {day.activities.length} activit{day.activities.length !== 1 ? 'ies' : 'y'}
                  </Badge>
                </div>

                {/* Day Notes */}
                {day.notes && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-foreground italic">{day.notes}</p>
                  </div>
                )}

                {/* Activities List */}
                <div className="space-y-3">
                  {day.activities.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted-foreground mb-3">No activities added yet</p>
                      <ActivityForm
                        dayId={day.id}
                        onSaved={handleActivitySaved}
                        trigger={
                          <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-3 w-3" />
                            Add Activity
                          </Button>
                        }
                      />
                    </div>
                  ) : (
                    <>
                      {day.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                        >
                          {/* Time */}
                          {activity.start_time && (
                            <div className="flex-shrink-0 text-sm font-mono text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{activity.start_time}</span>
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                              <h4 className="font-semibold text-foreground truncate">
                                {activity.title}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={`text-xs capitalize flex-shrink-0 ${
                                  CATEGORY_COLORS[activity.category as keyof typeof CATEGORY_COLORS] ||
                                  CATEGORY_COLORS.general
                                }`}
                              >
                                {activity.category}
                              </Badge>
                            </div>

                            {activity.location_name && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{activity.location_name}</span>
                              </div>
                            )}

                            {activity.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {activity.description}
                              </p>
                            )}

                            {activity.cost > 0 && (
                              <p className="text-xs text-foreground mt-1">
                                Cost: <span className="font-semibold">¥{activity.cost.toLocaleString()}</span>
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ActivityForm
                              dayId={day.id}
                              initialActivity={activity}
                              onSaved={handleActivitySaved}
                              trigger={
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteActivity(activity.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <ActivityForm
                        dayId={day.id}
                        onSaved={handleActivitySaved}
                        trigger={
                          <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                            <Plus className="h-3 w-3" />
                            Add Activity
                          </Button>
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
