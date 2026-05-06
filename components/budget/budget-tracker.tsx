'use client'

import { useEffect, useState } from 'react'
import { useTrip } from '@/lib/trip-context'
import { createClient } from '@/lib/supabase/client'
import { BudgetItem, BUDGET_CATEGORIES } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { DollarSign, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'

const CATEGORY_ICONS = {
  flights: '✈️',
  accommodation: '🏨',
  transport: '🚄',
  food: '🍜',
  activities: '🎭',
  shopping: '🛍️',
  other: '📌',
}

interface BudgetFormData {
  category: string
  description: string
  estimated_cost: string
  actual_cost: string
  is_paid: boolean
}

export function BudgetTracker() {
  const { trip } = useTrip()
  const [items, setItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<BudgetFormData>({
    category: 'other',
    description: '',
    estimated_cost: '',
    actual_cost: '',
    is_paid: false,
  })
  const supabase = createClient()

  // Fetch budget items
  useEffect(() => {
    const fetchBudgetItems = async () => {
      if (!trip?.id) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('budget_items')
          .select('*')
          .eq('trip_id', trip.id)
          .order('category', { ascending: true })

        if (error) throw error
        setItems(data || [])
      } catch (error) {
        console.error('[v0] Error fetching budget items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBudgetItems()
  }, [trip?.id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trip?.id || !formData.category) return

    try {
      const data = {
        trip_id: trip.id,
        category: formData.category,
        description: formData.description || null,
        estimated_cost: parseFloat(formData.estimated_cost) || 0,
        actual_cost: formData.actual_cost ? parseFloat(formData.actual_cost) : null,
        currency: 'JPY',
        is_paid: formData.is_paid,
      }

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('budget_items')
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
          .from('budget_items')
          .insert([data])
          .select()

        if (error) throw error
        if (created?.[0]) {
          setItems([...items, created[0]])
        }
      }

      setFormData({
        category: 'other',
        description: '',
        estimated_cost: '',
        actual_cost: '',
        is_paid: false,
      })
      setIsOpen(false)
    } catch (error) {
      console.error('[v0] Error saving budget item:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('budget_items').delete().eq('id', id)

      if (error) throw error

      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting budget item:', error)
    }
  }

  const handleEdit = (item: BudgetItem) => {
    setFormData({
      category: item.category,
      description: item.description || '',
      estimated_cost: item.estimated_cost.toString(),
      actual_cost: item.actual_cost?.toString() || '',
      is_paid: item.is_paid,
    })
    setEditingId(item.id)
    setIsOpen(true)
  }

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .update({ is_paid: !isPaid })
        .eq('id', id)

      if (error) throw error

      setItems(
        items.map((item) =>
          item.id === id ? { ...item, is_paid: !isPaid } : item
        )
      )
    } catch (error) {
      console.error('[v0] Error updating budget item:', error)
    }
  }

  // Calculate totals
  const totalEstimated = items.reduce((sum, item) => sum + item.estimated_cost, 0)
  const totalActual = items.reduce((sum, item) => sum + (item.actual_cost || 0), 0)
  const totalPaid = items.filter((item) => item.is_paid).reduce((sum, item) => sum + (item.actual_cost || item.estimated_cost), 0)
  const unpaidAmount = totalActual - totalPaid

  // Group by category
  const groupedByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, BudgetItem[]>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
            <DollarSign className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Budget Tracker</h1>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    category: 'other',
                    description: '',
                    estimated_cost: '',
                    actual_cost: '',
                    is_paid: false,
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
                  {editingId ? 'Edit Budget Item' : 'Add Budget Item'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category *
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
                      {BUDGET_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]} {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="e.g., Round trip flights"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="estimated" className="text-sm font-medium">
                      Estimated *
                    </Label>
                    <Input
                      id="estimated"
                      type="number"
                      placeholder="0"
                      min="0"
                      step="100"
                      value={formData.estimated_cost}
                      onChange={(e) =>
                        setFormData({ ...formData, estimated_cost: e.target.value })
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="actual" className="text-sm font-medium">
                      Actual
                    </Label>
                    <Input
                      id="actual"
                      type="number"
                      placeholder="0"
                      min="0"
                      step="100"
                      value={formData.actual_cost}
                      onChange={(e) =>
                        setFormData({ ...formData, actual_cost: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="paid"
                    checked={formData.is_paid}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_paid: checked === true })
                    }
                  />
                  <Label htmlFor="paid" className="text-sm font-medium cursor-pointer">
                    Mark as paid
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.estimated_cost}>
                    {editingId ? 'Update' : 'Add'} Item
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground">
          Track and manage your trip expenses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Estimated</p>
            <p className="text-2xl font-bold text-foreground">
              ¥{totalEstimated.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Actual Spent</p>
            <p className="text-2xl font-bold text-primary">
              ¥{totalActual.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold text-green-600">
              ¥{totalPaid.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Unpaid</p>
            <p className={`text-2xl font-bold ${unpaidAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              ¥{unpaidAmount.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      {totalEstimated > 0 && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Budget Usage</h3>
              <span className="text-sm text-muted-foreground">
                {((totalActual / totalEstimated) * 100).toFixed(0)}%
              </span>
            </div>
            <Progress
              value={Math.min((totalActual / totalEstimated) * 100, 100)}
              className="h-2"
            />
          </div>
        </Card>
      )}

      {/* Budget Items by Category */}
      {Object.keys(groupedByCategory).length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-lg font-semibold text-foreground">No Budget Items</h3>
          <p className="text-muted-foreground">Start by adding your first expense.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
            <Card key={category} className="overflow-hidden">
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground capitalize flex items-center gap-2">
                  <span>{CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}</span>
                  {category}
                  <Badge variant="secondary" className="ml-auto">
                    {categoryItems.length}
                  </Badge>
                </h3>

                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                    >
                      <Checkbox
                        checked={item.is_paid}
                        onCheckedChange={() =>
                          handleTogglePaid(item.id, item.is_paid)
                        }
                      />

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            item.is_paid ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {item.description || 'Unnamed'}
                        </p>
                        <div className="flex gap-2 flex-wrap text-xs text-muted-foreground">
                          <span>Est: ¥{item.estimated_cost.toLocaleString()}</span>
                          {item.actual_cost && (
                            <span>Actual: ¥{item.actual_cost.toLocaleString()}</span>
                          )}
                        </div>
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
