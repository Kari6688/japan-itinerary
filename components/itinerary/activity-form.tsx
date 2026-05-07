'use client'

import { useState } from 'react'
import { Activity, ACTIVITY_CATEGORIES } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Loader } from 'lucide-react'

interface ActivityFormProps {
  dayId: string
  initialActivity?: Activity
  onSaved: (activity: Activity) => void
  trigger: React.ReactNode
}

export function ActivityForm({
  dayId,
  initialActivity,
  onSaved,
  trigger,
}: ActivityFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialActivity?.title || '',
    description: initialActivity?.description || '',
    location_name: initialActivity?.location_name || '',
    latitude: initialActivity?.latitude?.toString() || '',
    longitude: initialActivity?.longitude?.toString() || '',
    start_time: initialActivity?.start_time || '',
    end_time: initialActivity?.end_time || '',
    category: initialActivity?.category || 'general',
    cost: initialActivity?.cost?.toString() || '0',
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        day_id: dayId,
        title: formData.title,
        description: formData.description || null,
        location_name: formData.location_name || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        category: formData.category,
        cost: parseFloat(formData.cost) || 0,
        currency: 'JPY',
      }

      if (initialActivity?.id) {
        // Update existing
        const { data: updated, error } = await supabase
          .from('activities')
          .update(data)
          .eq('id', initialActivity.id)
          .select()

        if (error) throw error
        if (updated?.[0]) {
          onSaved(updated[0])
        }
      } else {
        // Create new
        const { data: created, error } = await supabase
          .from('activities')
          .insert([data])
          .select()

        if (error) throw error
        if (created?.[0]) {
          onSaved(created[0])
        }
      }

      setOpen(false)
      setFormData({
        title: '',
        description: '',
        location_name: '',
        latitude: '',
        longitude: '',
        start_time: '',
        end_time: '',
        category: 'general',
        cost: '0',
      })
    } catch (error) {
      console.error('[v0] Error saving activity:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialActivity ? 'Edit Activity' : 'Add Activity'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your activity. Location coordinates are optional but helpful for the map.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Activity Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Senso-ji Temple"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add details about this activity..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          {/* Location Details */}
          <div className="space-y-3 p-3 rounded-lg bg-muted/50">
            <h3 className="text-sm font-semibold text-foreground">Location</h3>
            
            <div>
              <Label htmlFor="location_name" className="text-xs font-medium">
                Location Name
              </Label>
              <Input
                id="location_name"
                placeholder="e.g., Asakusa, Tokyo"
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="latitude" className="text-xs font-medium">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  placeholder="35.7149"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-xs font-medium">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  placeholder="139.7967"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Time and Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start_time" className="text-sm font-medium">
                Start Time
              </Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end_time" className="text-sm font-medium">
                End Time
              </Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cost" className="text-sm font-medium">
              Cost (JPY)
            </Label>
            <Input
              id="cost"
              type="number"
              placeholder="0"
              min="0"
              step="100"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title || loading} className="gap-2">
              {loading && <Loader className="h-4 w-4 animate-spin" />}
              {initialActivity ? 'Update Activity' : 'Add Activity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
