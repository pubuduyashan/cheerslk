CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  polygon GEOGRAPHY(Polygon, 4326) NOT NULL,
  base_delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 250.00,
  per_km_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 1000.00,
  free_delivery_threshold NUMERIC(10, 2),
  operating_hours JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_zones_updated_at
  BEFORE UPDATE ON delivery_zones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Delivery zones are publicly readable"
  ON delivery_zones FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage delivery zones"
  ON delivery_zones FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_delivery_zones_polygon ON delivery_zones USING GIST(polygon);
