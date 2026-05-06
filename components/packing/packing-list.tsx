'use client'

import { useEffect, useState } from 'react'
import { useTrip } from '@/lib/trip-context'
import { createClient } from '@/lib/supabase/client'
import { PackingItem, PACKING_CATEGORIES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Backpack, Plus, Trash2, Edit2 } from 'lucide-react'
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

const CATEGORY_ICONS = {
  clothing: '👔',
  toiletries: '🧴',
  electronics: '📱',
  documents: '📄',
  medicine: '💊',
  accessories: '👜',
  other: '📦',
}

interface PackingFormData {
  name: string
  category: string
  quantity: string
}

export function PackingList() {
  const { trip } = useTrip()
  const [items, setItems] = useState<PackingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PackingFormData>({
    name: '',
    category: 'other',
    quantity: '1',
  })
  const supabase = createClient()

  // Fetch packing items
  useEffect(() => {
    const fetchPackingItems = async () => {
      if (!trip?.id) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('packing_items')
          .select('*')
          .eq('trip_id', trip.id)
          .order('category', { ascending: true })

        if (error) throw error
        setItems(data || [])
      } catch (error) {
        console.error('[v0] Error fetching packing items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackingItems()
  }, [trip?.id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trip?.id || !formData.name) return

    try {
      const data = {
        trip_id: trip.id,
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 1,
      }

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('packing_items')
          .update(data)
          .eq('id', editingId)

        if (error) throw error

        setItems(
          items.map((item) => (item.id === editingId ? { ...item, ...data } : item))
        )
        setEditingId(null)
      } else {
        // Create
        const { data: created, error } = await supabase
          .from('packing_items')
          .insert([data])
          .select()

        if (error) throw error
        if (created?.[0]) {
          setItems([...items, created[0]])
        }
      }

      setFormData({
        name: '',
        category: 'other',
        quantity: '1',
      })
      setIsOpen(false)
    } catch (error) {
      console.error('[v0] Error saving packing item:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('packing_items').delete().eq('id', id)

      if (error) throw error

      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting packing item:', error)
    }
  }

  const handleEdit = (item: PackingItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
    })
    setEditingId(item.id)
    setIsOpen(true)
  }

  const handleTogglePacked = async (id: string, isPacked: boolean) => {
    try {
      const { error } = await supabase
        .from('packing_items')
        .update({ is_packed: !isPacked })
        .eq('id', id)

      if (error) throw error

      setItems(
        items.map((item) =>
          item.id === id ? { ...item, is_packed: !isPacked } : item
        )
      )
    } catch (error) {
      console.error('[v0] Error updating packing item:', error)
    }
  }

  // Calculate stats
  const totalItems = items.length
  const packedItems = items.filter((item) => item.is_packed).length
  const packedPercentage = totalItems > 0 ? (packedItems / totalItems) * 100 : 0

  // Group by category
  const groupedByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, PackingItem[]>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Backpack className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Packing List</h1>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    name: '',
                    category: 'other',
                    quantity: '1',
                  })
                }}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Packing Item' : 'Add Packing Item'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Item Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Comfortable shoes"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
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
                      {PACKING_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]} {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="mt-1"
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
                  <Button type="submit" disabled={!formData.name}>
                    {editingId ? 'Update' : 'Add'} Item
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">
          Organize and track what you need to pack
        </p>
      </div>

      {/* Progress Section */}
      {totalItems > 0 && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Packing Progress</h3>
              <span className="text-sm font-medium text-primary">
                {packedItems}/{totalItems} packed
              </span>
            </div>
            <Progress value={packedPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {packedPercentage.toFixed(0)}% complete
            </p>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{totalItems}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">{packedItems}</p>
            <p className="text-xs text-muted-foreground">Packed</p>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-orange-600">{totalItems - packedItems}</p>
            <p className="text-xs text-muted-foreground">To Pack</p>
          </div>
        </Card>
      </div>

      {/* Packing Items by Category */}
      {Object.keys(groupedByCategory).length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Backpack className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">Empty Packing List</h3>
          <p className="text-muted-foreground">
            Start adding items to your packing list.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
            <Card key={category} className="overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground capitalize flex items-center gap-2">
                    <span>{CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}</span>
                    {category}
                  </h3>
                  <Badge variant="secondary">
                    {categoryItems.filter((i) => i.is_packed).length}/{categoryItems.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                    >
                      <Checkbox
                        checked={item.is_packed}
                        onCheckedChange={() =>
                          handleTogglePacked(item.id, item.is_packed)
                        }
                      />

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            item.is_packed
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {item.name}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
