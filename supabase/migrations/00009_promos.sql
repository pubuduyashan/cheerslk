CREATE TYPE promo_type AS ENUM ('percentage', 'fixed', 'free_delivery');

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type promo_type NOT NULL,
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value >= 0),
  max_discount NUMERIC(10, 2),
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  max_uses INTEGER NOT NULL DEFAULT 0,
  max_uses_per_user INTEGER NOT NULL DEFAULT 1,
  applicable_categories UUID[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  current_uses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_promos_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active promos are publicly readable"
  ON promo_codes FOR SELECT
  USING (is_active = TRUE AND valid_until > NOW());

CREATE POLICY "Admins can manage promos"
  ON promo_codes FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own promo usage"
  ON promo_code_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage promo usage"
  ON promo_code_usage FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_usage_user ON promo_code_usage(user_id);
CREATE INDEX idx_promo_usage_promo ON promo_code_usage(promo_code_id);
