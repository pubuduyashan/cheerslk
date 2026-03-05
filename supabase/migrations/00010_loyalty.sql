CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE loyalty_transaction_type AS ENUM ('earned', 'redeemed', 'expired', 'bonus');

CREATE TABLE loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points_balance INTEGER NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
  tier loyalty_tier NOT NULL DEFAULT 'bronze',
  lifetime_points INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  points INTEGER NOT NULL,
  type loyalty_transaction_type NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_loyalty_updated_at
  BEFORE UPDATE ON loyalty_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update tier based on lifetime points
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tier = CASE
    WHEN NEW.lifetime_points >= 15000 THEN 'platinum'
    WHEN NEW.lifetime_points >= 5000 THEN 'gold'
    WHEN NEW.lifetime_points >= 1000 THEN 'silver'
    ELSE 'bronze'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_loyalty_tier_trigger
  BEFORE INSERT OR UPDATE ON loyalty_accounts
  FOR EACH ROW EXECUTE FUNCTION update_loyalty_tier();

-- RLS
ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty"
  ON loyalty_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage loyalty"
  ON loyalty_accounts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own transactions"
  ON loyalty_transactions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM loyalty_accounts WHERE loyalty_accounts.id = loyalty_transactions.account_id AND loyalty_accounts.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage transactions"
  ON loyalty_transactions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_loyalty_accounts_user ON loyalty_accounts(user_id);
CREATE INDEX idx_loyalty_transactions_account ON loyalty_transactions(account_id);
CREATE INDEX idx_loyalty_transactions_order ON loyalty_transactions(order_id);
