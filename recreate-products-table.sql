-- Complete recreation of products table with all required columns

-- First, create the product_category enum
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

-- Drop existing products table if it exists (WARNING: This will delete existing data)
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with complete schema
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,

    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    specification TEXT,
    
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2), -- The original price, if the product is on sale.
    
    category product_category,
    size TEXT, -- e.g., 'Small', 'Medium', 'Large'
    
    images TEXT[], -- An array of URLs to the product images.
    is_featured BOOLEAN DEFAULT false,

    -- For AI-related features
    ai_hint TEXT
);

-- Add indexes for better performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_category ON products(category);

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;