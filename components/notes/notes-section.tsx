'use client'

import { useEffect, useState } from 'react'
import { useTrip } from '@/lib/trip-context'
import { createClient } from '@/lib/supabase/client'
import { Note, NOTE_CATEGORIES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { StickyNote, Plus, Trash2, Edit2, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const CATEGORY_CONFIG = {
  restaurant: { icon: '🍽️', label: 'Restaurant' },
  tip: { icon: '💡', label: 'Tip' },
  phrase: { icon: '🗣️', label: 'Phrase' },
  emergency: { icon: '🚨', label: 'Emergency' },
  general: { icon: '📝', label: 'General' },
}

interface NoteFormData {
  title: string
  content: string
  category: string
}

export function NotesSection() {
  const { trip } = useTrip()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    category: 'general',
  })
  const supabase = createClient()

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!trip?.id) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('trip_id', trip.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setNotes(data || [])
      } catch (error) {
        console.error('[v0] Error fetching notes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [trip?.id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trip?.id || !formData.title) return

    try {
      const data = {
        trip_id: trip.id,
        title: formData.title,
        content: formData.content || null,
        category: formData.category,
      }

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('notes')
          .update(data)
          .eq('id', editingId)

        if (error) throw error

        setNotes(
          notes.map((note) => (note.id === editingId ? { ...note, ...data } : note))
        )
        setEditingId(null)
      } else {
        // Create
        const { data: created, error } = await supabase
          .from('notes')
          .insert([data])
          .select()

        if (error) throw error
        if (created?.[0]) {
          setNotes([created[0], ...notes])
        }
      }

      setFormData({
        title: '',
        content: '',
        category: 'general',
      })
      setIsOpen(false)
    } catch (error) {
      console.error('[v0] Error saving note:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id)

      if (error) throw error

      setNotes(notes.filter((note) => note.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting note:', error)
    }
  }

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content || '',
      category: note.category,
    })
    setEditingId(note.id)
    setIsOpen(true)
  }

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categoryCounts = Object.fromEntries(
    NOTE_CATEGORIES.map((cat) => [cat, notes.filter((n) => n.category === cat).length])
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Notes & Tips</h1>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    title: '',
                    content: '',
                    category: 'general',
                  })
                }}
              >
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Note' : 'Add a New Note'}
                </DialogTitle>
                <DialogDescription>
                  Save restaurant recommendations, useful phrases, tips, or any other important information for your trip.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Best ramen in Tokyo"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG].icon}{' '}
                          {CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium">
                    Details
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Add any additional information, directions, contact details, or tips..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="mt-1 resize-none"
                    rows={6}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.title}>
                    {editingId ? 'Update Note' : 'Add Note'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">
          Save important information, restaurant recommendations, useful phrases, and travel tips
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All ({notes.length})
          </Button>
          {NOTE_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG].icon}{' '}
              {CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG].label} (
              {categoryCounts[cat]})
            </Button>
          ))}
        </div>
      </div>

      {/* Notes Display */}
      {filteredNotes.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <StickyNote className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No Notes Yet</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'No notes match your search or filter.'
              : 'Start by saving your first note or tip.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const config =
              CATEGORY_CONFIG[note.category as keyof typeof CATEGORY_CONFIG] ||
              CATEGORY_CONFIG.general

            return (
              <Card
                key={note.id}
                className={cn(
                  'p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer group relative'
                )}
              >
                {/* Category and Actions */}
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {config.icon} {config.label}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEdit(note)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-foreground line-clamp-2">
                  {note.title}
                </h3>

                {/* Content */}
                {note.content && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content}
                  </p>
                )}

                {/* Date */}
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
