-- Fix UUID generation issue for products table

-- First, enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the existing products table and recreate with proper UUID handling
DROP TABLE IF EXISTS products CASCADE;

-- Create the product_category enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
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
    END IF;
END $$;

-- Create products table with proper UUID generation
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Add indexes for better performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_category ON products(category);

-- Test UUID generation
SELECT uuid_generate_v4() as test_uuid;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;