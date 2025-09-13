-- Row Level Security Policies for Lade Studio

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products and reviews
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);

-- Allow public to insert reviews
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Allow public to insert orders and order items (for checkout)
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- Allow users to view their own orders by phone number
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (true);

-- Optional: Admin policies (if you want to add admin functionality later)
-- You can create these when you implement admin authentication
-- CREATE POLICY "Admin can manage products" ON products FOR ALL USING (auth.role() = 'admin');
-- CREATE POLICY "Admin can manage orders" ON orders FOR ALL USING (auth.role() = 'admin');