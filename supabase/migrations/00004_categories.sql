CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_si TEXT NOT NULL DEFAULT '',
  name_ta TEXT NOT NULL DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  requires_age_verification BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS - publicly readable
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_sort ON categories(sort_order);
