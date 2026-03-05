CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326),
  special_instructions TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-set location from lat/lng
CREATE OR REPLACE FUNCTION set_address_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_address_location_trigger
  BEFORE INSERT OR UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION set_address_location();

-- RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_location ON addresses USING GIST(location);
