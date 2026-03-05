CREATE TYPE order_status AS ENUM (
  'pending', 'paid', 'confirmed', 'preparing',
  'rider_assigned', 'picked_up', 'in_transit',
  'delivered', 'cancelled', 'refunded'
);
CREATE TYPE delivery_type AS ENUM ('immediate', 'scheduled');
CREATE TYPE payment_method AS ENUM ('payhere', 'cash_on_delivery');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'CL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  rider_id UUID REFERENCES profiles(id),
  address_id UUID NOT NULL REFERENCES addresses(id),
  order_number TEXT UNIQUE NOT NULL DEFAULT generate_order_number(),
  status order_status NOT NULL DEFAULT 'pending',
  delivery_type delivery_type NOT NULL DEFAULT 'immediate',
  scheduled_delivery_at TIMESTAMPTZ,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method payment_method NOT NULL DEFAULT 'payhere',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  promo_code_id UUID,
  loyalty_points_used INTEGER NOT NULL DEFAULT 0,
  loyalty_points_earned INTEGER NOT NULL DEFAULT 0,
  special_instructions TEXT,
  confirmed_at TIMESTAMPTZ,
  preparing_at TIMESTAMPTZ,
  rider_assigned_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  in_transit_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-record status changes
CREATE OR REPLACE FUNCTION record_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());

    -- Set timestamp for the new status
    CASE NEW.status
      WHEN 'confirmed' THEN NEW.confirmed_at = NOW();
      WHEN 'preparing' THEN NEW.preparing_at = NOW();
      WHEN 'rider_assigned' THEN NEW.rider_assigned_at = NOW();
      WHEN 'picked_up' THEN NEW.picked_up_at = NOW();
      WHEN 'in_transit' THEN NEW.in_transit_at = NOW();
      WHEN 'delivered' THEN NEW.delivered_at = NOW();
      WHEN 'cancelled' THEN NEW.cancelled_at = NOW();
      ELSE NULL;
    END CASE;
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_status_change
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION record_order_status_change();

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Riders can view assigned orders"
  ON orders FOR SELECT
  USING (auth.uid() = rider_id);

CREATE POLICY "Riders can update assigned orders"
  ON orders FOR UPDATE
  USING (auth.uid() = rider_id);

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Order items readable by assigned rider"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.rider_id = auth.uid())
  );

CREATE POLICY "Admins can manage order items"
  ON order_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Status history viewable by order owner"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage status history"
  ON order_status_history FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_rider ON orders(rider_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
