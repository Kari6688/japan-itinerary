-- Japan 2026 Trip Planner Database Schema

-- Trips table (main trip info)
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Japan 2026',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Days table (each day of the trip)
CREATE TABLE IF NOT EXISTS days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table (activities for each day)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIME,
  end_time TIME,
  location_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  category TEXT DEFAULT 'general',
  cost DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'JPY',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget items table (for tracking expenses)
CREATE TABLE IF NOT EXISTS budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  estimated_cost DECIMAL(10, 2) DEFAULT 0,
  actual_cost DECIMAL(10, 2),
  currency TEXT DEFAULT 'JPY',
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packing items table
CREATE TABLE IF NOT EXISTS packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  quantity INTEGER DEFAULT 1,
  is_packed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table (general notes and tips)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips
CREATE POLICY "trips_select_own" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert_own" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update_own" ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trips_delete_own" ON trips FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for days (via trip ownership)
CREATE POLICY "days_select_own" ON days FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = days.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "days_insert_own" ON days FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = days.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "days_update_own" ON days FOR UPDATE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = days.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "days_delete_own" ON days FOR DELETE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = days.trip_id AND trips.user_id = auth.uid())
);

-- RLS Policies for activities (via day/trip ownership)
CREATE POLICY "activities_select_own" ON activities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM days 
    JOIN trips ON trips.id = days.trip_id 
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  )
);
CREATE POLICY "activities_insert_own" ON activities FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM days 
    JOIN trips ON trips.id = days.trip_id 
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  )
);
CREATE POLICY "activities_update_own" ON activities FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM days 
    JOIN trips ON trips.id = days.trip_id 
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  )
);
CREATE POLICY "activities_delete_own" ON activities FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM days 
    JOIN trips ON trips.id = days.trip_id 
    WHERE days.id = activities.day_id AND trips.user_id = auth.uid()
  )
);

-- RLS Policies for budget_items (via trip ownership)
CREATE POLICY "budget_items_select_own" ON budget_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = budget_items.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "budget_items_insert_own" ON budget_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = budget_items.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "budget_items_update_own" ON budget_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = budget_items.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "budget_items_delete_own" ON budget_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = budget_items.trip_id AND trips.user_id = auth.uid())
);

-- RLS Policies for packing_items (via trip ownership)
CREATE POLICY "packing_items_select_own" ON packing_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "packing_items_insert_own" ON packing_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "packing_items_update_own" ON packing_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "packing_items_delete_own" ON packing_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.user_id = auth.uid())
);

-- RLS Policies for notes (via trip ownership)
CREATE POLICY "notes_select_own" ON notes FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = notes.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "notes_insert_own" ON notes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = notes.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "notes_update_own" ON notes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = notes.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "notes_delete_own" ON notes FOR DELETE USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = notes.trip_id AND trips.user_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_days_trip_id ON days(trip_id);
CREATE INDEX IF NOT EXISTS idx_days_date ON days(date);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_order ON activities(order_index);
CREATE INDEX IF NOT EXISTS idx_budget_items_trip_id ON budget_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_packing_items_trip_id ON packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_notes_trip_id ON notes(trip_id);
