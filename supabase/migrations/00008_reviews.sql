CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  rider_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES products(id),
  delivery_rating INTEGER NOT NULL CHECK (delivery_rating BETWEEN 1 AND 5),
  rider_rating INTEGER CHECK (rider_rating IS NULL OR rider_rating BETWEEN 1 AND 5),
  product_rating INTEGER CHECK (product_rating IS NULL OR product_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update product average rating on new review
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.product_id IS NOT NULL AND NEW.product_rating IS NOT NULL THEN
    UPDATE products SET
      average_rating = (
        SELECT AVG(product_rating) FROM reviews
        WHERE product_id = NEW.product_id AND product_rating IS NOT NULL
      ),
      review_count = (
        SELECT COUNT(*) FROM reviews
        WHERE product_id = NEW.product_id AND product_rating IS NOT NULL
      )
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create reviews for own orders"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage reviews"
  ON reviews FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rider ON reviews(rider_id);
