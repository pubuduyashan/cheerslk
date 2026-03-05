-- ============================================
-- CheersLK Seed Data
-- ============================================

-- Categories
INSERT INTO categories (id, name_en, name_si, name_ta, slug, sort_order, requires_age_verification, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Spirits', 'බීර සහ මද්‍යසාර', 'மதுபானங்கள்', 'spirits', 1, TRUE, TRUE),
  ('a1000000-0000-0000-0000-000000000002', 'Beer', 'බියර්', 'பீர்', 'beer', 2, TRUE, TRUE),
  ('a1000000-0000-0000-0000-000000000003', 'Wine', 'වයින්', 'ஒயின்', 'wine', 3, TRUE, TRUE),
  ('a1000000-0000-0000-0000-000000000004', 'Cigarettes', 'සිගරට්', 'சிகரெட்', 'cigarettes', 4, TRUE, TRUE),
  ('a1000000-0000-0000-0000-000000000005', 'Mixers & Soft Drinks', 'මිශ්‍ර පාන', 'கலப்பு பானங்கள்', 'mixers', 5, FALSE, TRUE),
  ('a1000000-0000-0000-0000-000000000006', 'Snacks', 'කෙටි ආහාර', 'சிற்றுண்டி', 'snacks', 6, FALSE, TRUE),
  ('a1000000-0000-0000-0000-000000000007', 'Essentials', 'අත්‍යවශ්‍ය', 'அத்தியாவசியம்', 'essentials', 7, FALSE, TRUE);

-- Products: Spirits
INSERT INTO products (category_id, name_en, name_si, name_ta, description_en, price, compare_at_price, sku, stock_quantity, abv, volume_ml, brand, origin_country, status) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Old Reserve Arrack', 'ඕල්ඩ් රිසර්ව් අරක්කු', 'ஓல்ட் ரிசர்வ் அரக்கு', 'Premium Sri Lankan coconut arrack, aged for smooth flavor', 2850.00, NULL, 'SPR-001', 100, 33.50, 750, 'DCSL', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000001', 'Extra Special Arrack', 'එක්ස්ට්‍රා ස්පෙෂල් අරක්කු', 'எக்ஸ்ட்ரா ஸ்பெஷல் அரக்கு', 'Classic Sri Lankan arrack, the island favorite', 1950.00, NULL, 'SPR-002', 150, 33.50, 750, 'DCSL', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000001', 'Mendis Coconut Arrack', 'මෙන්ඩිස් පොල් අරක්කු', 'மெண்டிஸ் தேங்காய் அரக்கு', 'Smooth coconut arrack by Mendis', 2200.00, NULL, 'SPR-003', 80, 33.50, 750, 'Mendis', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000001', 'Johnnie Walker Black Label', 'ජොනී වෝකර් බ්ලැක් ලේබල්', 'ஜானி வாக்கர் பிளாக் லேபிள்', 'Iconic blended Scotch whisky with rich, smoky flavor', 12500.00, 13500.00, 'SPR-004', 30, 40.00, 750, 'Johnnie Walker', 'Scotland', 'active'),
  ('a1000000-0000-0000-0000-000000000001', 'Jack Daniel''s Tennessee Whiskey', 'ජැක් ඩැනියෙල්ස්', 'ஜாக் டேனியல்ஸ்', 'Smooth sipping Tennessee whiskey', 11500.00, NULL, 'SPR-005', 25, 40.00, 750, 'Jack Daniel''s', 'USA', 'active'),
  ('a1000000-0000-0000-0000-000000000001', 'Rockland Gin', 'රොක්ලන්ඩ් ජින්', 'ராக்லாண்ட் ஜின்', 'Sri Lankan dry gin, perfect for G&T', 1650.00, NULL, 'SPR-006', 60, 37.50, 750, 'Rockland', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000001', 'Absolut Vodka', 'ඇබ්සලියුට් වොඩ්කා', 'அப்சொலூட் வோட்கா', 'Premium Swedish vodka', 7500.00, NULL, 'SPR-007', 40, 40.00, 750, 'Absolut', 'Sweden', 'active');

-- Products: Beer
INSERT INTO products (category_id, name_en, name_si, name_ta, description_en, price, compare_at_price, sku, stock_quantity, abv, volume_ml, brand, origin_country, status) VALUES
  ('a1000000-0000-0000-0000-000000000002', 'Lion Lager', 'ලයන් ලාගර්', 'லயன் லேகர்', 'Sri Lanka''s most popular lager beer', 450.00, NULL, 'BEER-001', 200, 4.80, 330, 'Lion Brewery', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000002', 'Lion Stout', 'ලයන් ස්ටවුට්', 'லயன் ஸ்டவுட்', 'Award-winning Sri Lankan stout with rich chocolate notes', 500.00, NULL, 'BEER-002', 150, 8.00, 330, 'Lion Brewery', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000002', 'Three Coins Pilsner', 'ත්‍රී කොයින්ස් පිල්ස්නර්', 'த்ரீ காயின்ஸ் பில்ஸ்னர்', 'Crisp European-style pilsner brewed in Sri Lanka', 480.00, NULL, 'BEER-003', 120, 4.80, 330, 'Three Coins', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000002', 'Carlsberg', 'කාල්ස්බර්ග්', 'கார்ல்ஸ்பெர்க்', 'Probably the best beer in the world', 550.00, NULL, 'BEER-004', 100, 5.00, 330, 'Carlsberg', 'Denmark', 'active'),
  ('a1000000-0000-0000-0000-000000000002', 'Heineken', 'හයිනකන්', 'ஹெய்னகன்', 'Premium Dutch lager with a distinctive taste', 600.00, NULL, 'BEER-005', 80, 5.00, 330, 'Heineken', 'Netherlands', 'active');

-- Products: Wine
INSERT INTO products (category_id, name_en, name_si, name_ta, description_en, price, compare_at_price, sku, stock_quantity, abv, volume_ml, brand, origin_country, status) VALUES
  ('a1000000-0000-0000-0000-000000000003', 'Jacob''s Creek Shiraz', 'ජැකබ්ස් ක්‍රීක් ෂිරාස්', 'ஜேகப்ஸ் க்ரீக் ஷிராஸ்', 'Full-bodied Australian Shiraz with rich berry flavors', 4500.00, NULL, 'WINE-001', 40, 13.50, 750, 'Jacob''s Creek', 'Australia', 'active'),
  ('a1000000-0000-0000-0000-000000000003', 'Barefoot Moscato', 'බෙයාෆුට් මොස්කාටෝ', 'பேர்ஃபுட் மொஸ்காட்டோ', 'Sweet and refreshing Moscato wine', 4200.00, NULL, 'WINE-002', 35, 9.00, 750, 'Barefoot', 'USA', 'active');

-- Products: Cigarettes
INSERT INTO products (category_id, name_en, name_si, name_ta, description_en, price, sku, stock_quantity, brand, origin_country, max_per_order, status) VALUES
  ('a1000000-0000-0000-0000-000000000004', 'Dunhill Switch', 'ඩන්හිල් ස්විච්', 'டன்ஹில் ஸ்விட்ச்', 'Dunhill switch cigarettes', 1200.00, 'CIG-001', 300, 'Dunhill', 'UK', 5, 'active'),
  ('a1000000-0000-0000-0000-000000000004', 'John Player Gold Leaf', 'ජෝන් ප්ලේයර් ගෝල්ඩ් ලීෆ්', 'ஜான் பிளேயர் கோல்ட் லீஃப்', 'Popular cigarettes in Sri Lanka', 900.00, 'CIG-002', 500, 'John Player', 'Sri Lanka', 5, 'active');

-- Products: Mixers & Soft Drinks
INSERT INTO products (category_id, name_en, name_si, name_ta, description_en, price, sku, stock_quantity, volume_ml, brand, origin_country, status) VALUES
  ('a1000000-0000-0000-0000-000000000005', 'Coca-Cola', 'කෝකා කෝලා', 'கோகா கோலா', 'Ice cold Coca-Cola', 200.00, 'MIX-001', 300, 400, 'Coca-Cola', 'USA', 'active'),
  ('a1000000-0000-0000-0000-000000000005', 'Elephant House Ginger Beer', 'එලිපන්ට් හවුස් ජින්ජර් බියර්', 'எலிஃபண்ட் ஹவுஸ் ஜிஞ்சர் பீர்', 'Classic Sri Lankan ginger beer, great mixer', 150.00, 'MIX-002', 250, 400, 'Elephant House', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000005', 'Schweppes Tonic Water', 'ෂ්වෙප්ස් ටොනික් වෝටර්', 'ஷ்வெப்ஸ் டானிக் வாட்டர்', 'Premium tonic water for G&T', 350.00, 'MIX-003', 150, 400, 'Schweppes', 'UK', 'active'),
  ('a1000000-0000-0000-0000-000000000005', 'Red Bull Energy Drink', 'රෙඩ් බුල්', 'ரெட் புல்', 'Energy drink that gives you wings', 550.00, 'MIX-004', 200, 250, 'Red Bull', 'Austria', 'active');

-- Products: Snacks
INSERT INTO products (category_id, name_en, name_si, name_ta, description_en, price, sku, stock_quantity, brand, origin_country, status) VALUES
  ('a1000000-0000-0000-0000-000000000006', 'Munchee Cream Cracker', 'මන්චී ක්‍රීම් ක්‍රැකර්', 'மன்ச்சி க்ரீம் க்ராக்கர்', 'Classic Sri Lankan crackers', 350.00, 'SNK-001', 200, 'Munchee', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000006', 'Pringles Original', 'ප්‍රිංගල්ස් ඔරිජිනල්', 'ப்ரிங்கிள்ஸ் ஒரிஜினல்', 'Once you pop, you can''t stop', 850.00, 'SNK-002', 100, 'Pringles', 'USA', 'active');

-- Products: Essentials
INSERT INTO products (category_id, name_en, name_si, name_ta, description_en, price, sku, stock_quantity, brand, origin_country, status) VALUES
  ('a1000000-0000-0000-0000-000000000007', 'Ice Bag (2kg)', 'අයිස් බෑග් (2kg)', 'ஐஸ் பை (2kg)', 'Party ice bag - 2 kilograms', 300.00, 'ESS-001', 500, 'CheersLK', 'Sri Lanka', 'active'),
  ('a1000000-0000-0000-0000-000000000007', 'Disposable Cups (50 pack)', 'ඩිස්පෝසබල් කෝප්ප', 'டிஸ்போசபிள் கப்கள்', 'Pack of 50 disposable plastic cups', 400.00, 'ESS-002', 200, 'CheersLK', 'Sri Lanka', 'active');

-- Delivery Zone: Greater Colombo
INSERT INTO delivery_zones (id, name, polygon, base_delivery_fee, per_km_fee, min_order_amount, free_delivery_threshold, operating_hours, is_active) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Greater Colombo',
    ST_GeogFromText('POLYGON((79.82 6.85, 79.90 6.85, 79.90 6.98, 79.82 6.98, 79.82 6.85))'),
    250.00,
    50.00,
    1000.00,
    5000.00,
    '[{"day": "monday", "open": "09:00", "close": "23:00"}, {"day": "tuesday", "open": "09:00", "close": "23:00"}, {"day": "wednesday", "open": "09:00", "close": "23:00"}, {"day": "thursday", "open": "09:00", "close": "23:00"}, {"day": "friday", "open": "09:00", "close": "23:59"}, {"day": "saturday", "open": "09:00", "close": "23:59"}, {"day": "sunday", "open": "10:00", "close": "22:00"}]',
    TRUE
  );

-- Promo Codes
INSERT INTO promo_codes (code, type, discount_value, max_discount, min_order_amount, valid_from, valid_until, max_uses, max_uses_per_user, is_active) VALUES
  ('WELCOME20', 'percentage', 20.00, 500.00, 2000.00, '2024-01-01 00:00:00+00', '2026-12-31 23:59:59+00', 10000, 1, TRUE),
  ('FREEDELIVERY', 'free_delivery', 0.00, NULL, 1500.00, '2024-01-01 00:00:00+00', '2026-12-31 23:59:59+00', 5000, 3, TRUE);
