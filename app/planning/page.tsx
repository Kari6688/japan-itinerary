'use client'

import { useState } from 'react'
import { TripProvider } from '@/lib/trip-context'
import { Nav } from '@/components/nav'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHECKLISTS = [
  {
    title: 'Before You Go',
    items: [
      'Confirm visa / entry requirements',
      'Passport valid 6+ months',
      'Travel insurance booked',
      'Order yen or set up wise card',
      'Buy eSIM (Ubigi or Airalo)',
      'Decide on JR Pass vs IC card',
      'Download: Google Translate, Navitime, Suica',
    ]
  },
  {
    title: 'Packing',
    items: [
      'Type A/B plug adapter',
      'Power bank + cables',
      'Compact umbrella (Feb rain)',
      'Layers — Feb avg 4–10°C',
      'Comfortable walking shoes',
      'Day bag with zip pockets',
      'Masks (still common indoors)',
    ]
  },
  {
    title: 'Transit',
    items: [
      'Get Suica / Pasmo IC card',
      'Narita Express or Skyliner to city',
      'Note last train times (~midnight)',
      'Learn coin locker system at stations',
      'Study JR Yamanote loop map',
    ]
  },
  {
    title: 'Etiquette',
    items: [
      'No eating while walking',
      'Stand left on escalators (Tokyo)',
      'Remove shoes when required',
      'Carry cash (many places cash-only)',
      'Bow when greeting',
      'Queue politely everywhere',
      'Silence phone on trains',
    ]
  },
  {
    title: 'Useful Phrases',
    items: [
      'Sumimasen — Excuse me',
      'Arigatou gozaimasu — Thank you',
      'Kudasai — Please (when ordering)',
      'Ikura desu ka — How much?',
      'Eigo wa hanasemasu ka — Do you speak English?',
      'Oishii — Delicious',
      'Kawaii — Cute',
    ]
  },
  {
    title: 'Emergency',
    items: [
      'Save embassy contact info',
      'Know hotel address in Japanese',
      'Download offline maps',
      'Note emergency number: 110 (police), 119 (fire/ambulance)',
      'Keep passport copy separate from original',
    ]
  },
]

function ChecklistSection({ 
  title, 
  items, 
  checkedItems, 
  onToggle 
}: { 
  title: string
  items: string[]
  checkedItems: Set<string>
  onToggle: (item: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const completedCount = items.filter(item => checkedItems.has(item)).length

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-accent/30 transition-colors"
      >
        <span className="font-medium text-foreground">{title}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-mono">
            {completedCount}/{items.length}
          </span>
          {isExpanded ? (
            <Minus className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Plus className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="pb-2">
          {items.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-accent/20 transition-colors"
            >
              <input
                type="checkbox"
                checked={checkedItems.has(item)}
                onChange={() => onToggle(item)}
                className="w-4 h-4 rounded border-border bg-transparent checked:bg-foreground checked:border-foreground focus:ring-0 focus:ring-offset-0"
              />
              <span className={cn(
                'text-sm transition-colors',
                checkedItems.has(item) ? 'text-muted-foreground line-through' : 'text-foreground'
              )}>
                {item}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function PlanningContent() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(item)) {
      newChecked.delete(item)
    } else {
      newChecked.add(item)
    }
    setCheckedItems(newChecked)
  }

  const totalItems = CHECKLISTS.reduce((acc, list) => acc + list.items.length, 0)
  const completedItems = checkedItems.size

  return (
    <div className="pt-12 min-h-screen bg-background">
      <Nav />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 border-b border-border pb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">Planning</h1>
          <p className="text-sm text-muted-foreground font-mono">
            {completedItems}/{totalItems} completed
          </p>
        </div>

        {/* Checklists */}
        <div className="border-t border-border">
          {CHECKLISTS.map((checklist) => (
            <ChecklistSection
              key={checklist.title}
              title={checklist.title}
              items={checklist.items}
              checkedItems={checkedItems}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PlanningPage() {
  return (
    <TripProvider>
      <PlanningContent />
    </TripProvider>
  )
}
