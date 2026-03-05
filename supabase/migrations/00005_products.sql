CREATE TYPE product_status AS ENUM ('active', 'inactive', 'out_of_stock');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name_en TEXT NOT NULL,
  name_si TEXT NOT NULL DEFAULT '',
  name_ta TEXT NOT NULL DEFAULT '',
  description_en TEXT,
  description_si TEXT,
  description_ta TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  sku TEXT UNIQUE NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  abv NUMERIC(5, 2),
  volume_ml INTEGER,
  brand TEXT,
  origin_country TEXT,
  max_per_order INTEGER NOT NULL DEFAULT 10,
  status product_status NOT NULL DEFAULT 'active',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  average_rating NUMERIC(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS - publicly readable
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_brand ON products(brand);

-- Full-text search with pg_trgm
CREATE INDEX idx_products_name_trgm ON products USING GIN (name_en gin_trgm_ops);
CREATE INDEX idx_products_brand_trgm ON products USING GIN (brand gin_trgm_ops);
