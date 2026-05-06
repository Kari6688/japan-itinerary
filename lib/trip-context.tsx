'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Trip, Day, Activity, BudgetItem, PackingItem, Note } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface TripContextType {
  user: User | null
  trip: Trip | null
  days: Day[]
  budgetItems: BudgetItem[]
  packingItems: PackingItem[]
  notes: Note[]
  loading: boolean
  isGuest: boolean
  refreshTrip: () => Promise<void>
  refreshDays: () => Promise<void>
  refreshBudget: () => Promise<void>
  refreshPacking: () => Promise<void>
  refreshNotes: () => Promise<void>
}

const TripContext = createContext<TripContextType | null>(null)

// Create a guest trip ID that persists in localStorage
const GUEST_TRIP_ID = 'guest-trip-japan-2026'

export function TripProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [days, setDays] = useState<Day[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [packingItems, setPackingItems] = useState<PackingItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  const supabase = createClient()

  const fetchTrip = useCallback(async (userId: string) => {
    const { data: existingTrip, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingTrip) {
      setTrip(existingTrip)
      setIsGuest(false)
      return existingTrip
    }

    // Create a new trip if none exists
    const { data: newTrip, error: insertError } = await supabase
      .from('trips')
      .insert({
        user_id: userId,
        name: 'Japan 2026',
        start_date: null,
        end_date: null
      })
      .select()
      .single()

    if (newTrip) {
      setTrip(newTrip)
      setIsGuest(false)
      return newTrip
    }
    
    return null
  }, [supabase])

  // Create a guest trip (not saved to database)
  const createGuestTrip = useCallback(() => {
    const guestTrip: Trip = {
      id: GUEST_TRIP_ID,
      user_id: 'guest',
      name: 'Japan 2026',
      start_date: null,
      end_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setTrip(guestTrip)
    setIsGuest(true)
    return guestTrip
  }, [])

  const refreshDays = useCallback(async () => {
    if (!trip || isGuest) return
    const { data } = await supabase
      .from('days')
      .select('*, activities(*)')
      .eq('trip_id', trip.id)
      .order('date', { ascending: true })
    
    if (data) {
      // Sort activities within each day
      const sortedDays = data.map(day => ({
        ...day,
        activities: day.activities?.sort((a: Activity, b: Activity) => a.order_index - b.order_index) || []
      }))
      setDays(sortedDays)
    }
  }, [trip, isGuest, supabase])

  const refreshBudget = useCallback(async () => {
    if (!trip || isGuest) return
    const { data } = await supabase
      .from('budget_items')
      .select('*')
      .eq('trip_id', trip.id)
      .order('created_at', { ascending: true })
    
    if (data) setBudgetItems(data)
  }, [trip, isGuest, supabase])

  const refreshPacking = useCallback(async () => {
    if (!trip || isGuest) return
    const { data } = await supabase
      .from('packing_items')
      .select('*')
      .eq('trip_id', trip.id)
      .order('category', { ascending: true })
    
    if (data) setPackingItems(data)
  }, [trip, isGuest, supabase])

  const refreshNotes = useCallback(async () => {
    if (!trip || isGuest) return
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('trip_id', trip.id)
      .order('created_at', { ascending: false })
    
    if (data) setNotes(data)
  }, [trip, isGuest, supabase])

  const refreshTrip = useCallback(async () => {
    if (!user) return
    await fetchTrip(user.id)
  }, [user, fetchTrip])

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          await fetchTrip(user.id)
        } else {
          // No user logged in - create guest trip
          createGuestTrip()
        }
      } catch (error) {
        console.error('[v0] Error getting user:', error)
        // On error, create guest trip
        createGuestTrip()
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchTrip(session.user.id)
      } else {
        // User logged out - create guest trip
        createGuestTrip()
        setDays([])
        setBudgetItems([])
        setPackingItems([])
        setNotes([])
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchTrip, createGuestTrip])

  useEffect(() => {
    if (trip && !isGuest) {
      refreshDays()
      refreshBudget()
      refreshPacking()
      refreshNotes()
    }
  }, [trip, isGuest, refreshDays, refreshBudget, refreshPacking, refreshNotes])

  return (
    <TripContext.Provider value={{
      user,
      trip,
      days,
      budgetItems,
      packingItems,
      notes,
      loading,
      isGuest,
      refreshTrip,
      refreshDays,
      refreshBudget,
      refreshPacking,
      refreshNotes
    }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
