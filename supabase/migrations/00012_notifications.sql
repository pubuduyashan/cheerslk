CREATE TYPE notification_type AS ENUM (
  'order_update', 'new_order', 'rider_assigned',
  'delivery_update', 'promo', 'system'
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  type notification_type NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage notifications"
  ON notifications FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- OTP codes managed by Edge Functions (service role)
CREATE POLICY "OTP codes service role only"
  ON otp_codes FOR ALL
  USING (FALSE);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_otp_phone ON otp_codes(phone);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);

-- Realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE riders;
