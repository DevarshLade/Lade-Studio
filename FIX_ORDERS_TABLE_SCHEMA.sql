-- Fix Orders Table Schema
-- Run this in your Supabase SQL Editor to ensure the orders table has the correct columns

-- First, let's check if the orders table exists and what columns it has
-- (This is just for reference - you can't run this as a query, but you can check manually)

-- Drop the table if it exists and recreate it with the correct schema
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

-- Recreate orders table with correct column names
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
    payment_id TEXT, -- For Razorpay or other payment gateway transaction ID
    
    -- Order status
    status TEXT NOT NULL DEFAULT 'Processing'
);

-- Recreate order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
-- Allow authenticated users to insert orders
CREATE POLICY "Authenticated users can insert orders" ON orders
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert order items
CREATE POLICY "Authenticated users can insert order items" ON order_items
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to view order items for their orders
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT TO authenticated USING (true);

-- Grant permissions
GRANT ALL ON TABLE orders TO authenticated;
GRANT ALL ON TABLE order_items TO authenticated;

-- Add some sample data to test (optional)
-- You can uncomment this section if you want to test with sample data

/*
INSERT INTO orders (
    customer_name,
    customer_phone,
    shipping_address_line1,
    shipping_address_line2,
    shipping_city,
    shipping_state,
    shipping_pincode,
    subtotal,
    shipping_cost,
    total_amount,
    payment_method,
    status
) VALUES (
    'Test Customer',
    '9876543210',
    '123 Test Street',
    'Apartment 1',
    'Mumbai',
    'Maharashtra',
    '400001',
    2500.00,
    100.00,
    2600.00,
    'cod',
    'Processing'
);
*/