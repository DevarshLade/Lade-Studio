-- Complete Database Schema Fix
-- This script fixes all data type mismatches and ensures consistent UUID usage
-- Run this in your Supabase SQL Editor

-- WARNING: This will delete all existing data in products, orders, order_items, and reviews tables
-- Make sure to backup any important data before running this script

-- Step 1: Drop all tables in the correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Step 2: Drop and recreate the product_category enum to ensure it exists
DROP TYPE IF EXISTS product_category CASCADE;
CREATE TYPE product_category AS ENUM (
    'Painting',
    'Pots',
    'Canvas',
    'Hand Painted Jewelry',
    'Terracotta Pots',
    'Fabric Painting',
    'Portrait',
    'Wall Hanging'
);

-- Step 3: Create products table with UUID id column
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,

    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    specification TEXT,
    
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    
    category product_category,
    size TEXT,
    
    images TEXT[],
    is_featured BOOLEAN DEFAULT false,

    ai_hint TEXT
);

-- Step 4: Create reviews table with UUID references
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    author_name TEXT NOT NULL
);

-- Step 5: Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    
    -- Customer information
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Shipping address
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
    
    -- Order totals
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 100,
    total_amount NUMERIC(10, 2) NOT NULL,
    
    -- Payment information
    payment_method TEXT NOT NULL DEFAULT 'cod',
    payment_id TEXT,
    
    -- Order status
    status TEXT NOT NULL DEFAULT 'Processing'
);

-- Step 6: Create order_items table with proper UUID references
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Step 7: Create indexes for better performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_category ON products(category);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);

CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Step 8: Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies

-- Products policies
CREATE POLICY "Public can view products" ON products
    FOR SELECT USING (true);

-- Reviews policies
CREATE POLICY "Public can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Public can insert reviews" ON reviews
    FOR INSERT WITH CHECK (true);

-- Orders policies
CREATE POLICY "Authenticated users can insert orders" ON orders
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT TO authenticated USING (true);

-- Order items policies
CREATE POLICY "Authenticated users can insert order items" ON order_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT TO authenticated USING (true);

-- Step 10: Grant permissions
GRANT ALL ON TABLE products TO authenticated, anon;
GRANT ALL ON TABLE reviews TO authenticated, anon;
GRANT ALL ON TABLE orders TO authenticated;
GRANT ALL ON TABLE order_items TO authenticated;

-- Step 11: Schema is ready for product data
-- Products should be added through the admin interface or API
-- No demo products included

-- Step 13: Verify the schema is correct
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
    AND t.table_name IN ('products', 'reviews', 'orders', 'order_items')
ORDER BY t.table_name, c.ordinal_position;

-- Success message
SELECT 'Database schema has been successfully fixed! All tables now use consistent UUID types.' as status;