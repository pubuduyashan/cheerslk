CREATE TYPE rider_status AS ENUM ('offline', 'online', 'on_delivery');
CREATE TYPE vehicle_type AS ENUM ('motorcycle', 'bicycle', 'three_wheeler', 'car');
CREATE TYPE rider_verification_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

CREATE TABLE riders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type vehicle_type NOT NULL DEFAULT 'motorcycle',
  vehicle_number TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_image TEXT,
  nic_front_image TEXT,
  nic_back_image TEXT,
  delivery_zone_id UUID,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  current_location GEOGRAPHY(Point, 4326),
  status rider_status NOT NULL DEFAULT 'offline',
  verification_status rider_verification_status NOT NULL DEFAULT 'pending',
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rider_location_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update location geography
CREATE OR REPLACE FUNCTION update_rider_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_lat IS NOT NULL AND NEW.current_lng IS NOT NULL THEN
    NEW.current_location = ST_SetSRID(ST_MakePoint(NEW.current_lng, NEW.current_lat), 4326)::geography;
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rider_location_trigger
  BEFORE INSERT OR UPDATE ON riders
  FOR EACH ROW EXECUTE FUNCTION update_rider_location();

-- RLS
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_location_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Riders can view own record"
  ON riders FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Riders can update own record"
  ON riders FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage riders"
  ON riders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Rider location history - own records"
  ON rider_location_history FOR ALL
  USING (
    EXISTS (SELECT 1 FROM riders WHERE riders.id = rider_location_history.rider_id AND riders.profile_id = auth.uid())
  );

CREATE POLICY "Admins can view rider locations"
  ON rider_location_history FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_riders_profile ON riders(profile_id);
CREATE INDEX idx_riders_status ON riders(status);
CREATE INDEX idx_riders_verification ON riders(verification_status);
CREATE INDEX idx_riders_location ON riders USING GIST(current_location);
CREATE INDEX idx_rider_location_history_rider ON rider_location_history(rider_id);
CREATE INDEX idx_rider_location_history_order ON rider_location_history(order_id);
CREATE INDEX idx_rider_location_history_time ON rider_location_history(timestamp DESC);
