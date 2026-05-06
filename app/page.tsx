'use client'

import { TripProvider } from '@/lib/trip-context'
import { DailyItineraryView } from '@/components/itinerary/daily-itinerary'
import { MapPage } from '@/components/map/map-page'
import { BudgetTracker } from '@/components/budget/budget-tracker'
import { PackingList } from '@/components/packing/packing-list'
import { NotesSection } from '@/components/notes/notes-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Map, Wallet, Package, BookOpen } from 'lucide-react'

export default function Dashboard() {
  return (
    <TripProvider>
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Japan 2026 Trip Planner
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organize your entire trip with itinerary, map, budget, and more
            </p>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="itinerary" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Itinerary</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="gap-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Budget</span>
              </TabsTrigger>
              <TabsTrigger value="packing" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Packing</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-6">
              <DailyItineraryView />
            </TabsContent>

            <TabsContent value="map" className="space-y-6">
              <MapPage />
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <BudgetTracker />
            </TabsContent>

            <TabsContent value="packing" className="space-y-6">
              <PackingList />
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <NotesSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TripProvider>
  )
}
