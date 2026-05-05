export interface Trip {
  id: string
  user_id: string
  name: string
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface Day {
  id: string
  trip_id: string
  date: string
  title: string | null
  notes: string | null
  created_at: string
  updated_at: string
  activities?: Activity[]
}

export interface Activity {
  id: string
  day_id: string
  title: string
  description: string | null
  start_time: string | null
  end_time: string | null
  location_name: string | null
  latitude: number | null
  longitude: number | null
  category: string
  cost: number
  currency: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface BudgetItem {
  id: string
  trip_id: string
  category: string
  description: string | null
  estimated_cost: number
  actual_cost: number | null
  currency: string
  is_paid: boolean
  created_at: string
  updated_at: string
}

export interface PackingItem {
  id: string
  trip_id: string
  name: string
  category: string
  quantity: number
  is_packed: boolean
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  trip_id: string
  title: string
  content: string | null
  category: string
  created_at: string
  updated_at: string
}

export const ACTIVITY_CATEGORIES = [
  'transport',
  'food',
  'sightseeing',
  'accommodation',
  'shopping',
  'entertainment',
  'general'
] as const

export const BUDGET_CATEGORIES = [
  'flights',
  'accommodation',
  'transport',
  'food',
  'activities',
  'shopping',
  'other'
] as const

export const PACKING_CATEGORIES = [
  'clothing',
  'toiletries',
  'electronics',
  'documents',
  'medicine',
  'accessories',
  'other'
] as const

export const NOTE_CATEGORIES = [
  'restaurant',
  'tip',
  'phrase',
  'emergency',
  'general'
] as const
