import { DailyItineraryView } from '@/components/itinerary/daily-itinerary'

export const metadata = {
  title: 'Daily Itinerary - Japan 2026',
  description: 'View and manage your daily activities for your Japan trip',
}

export default function ItineraryPage() {
  return (
    <div className="space-y-6">
      <DailyItineraryView />
    </div>
  )
}
