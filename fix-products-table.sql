-- Fix missing columns in products table

-- First, create the product_category enum if it doesn't exist
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

-- Add missing columns to products table
DO $$ 
BEGIN
    -- Add category column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category') THEN
        ALTER TABLE products ADD COLUMN category product_category;
    END IF;
    
    -- Add images column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'images') THEN
        ALTER TABLE products ADD COLUMN images TEXT[];
    END IF;
    
    -- Add is_featured column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    
    -- Add ai_hint column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'ai_hint') THEN
        ALTER TABLE products ADD COLUMN ai_hint TEXT;
    END IF;
    
    -- Add size column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'size') THEN
        ALTER TABLE products ADD COLUMN size TEXT;
    END IF;
    
    -- Add original_price column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN
        ALTER TABLE products ADD COLUMN original_price NUMERIC(10, 2);
    END IF;
    
    -- Add specification column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'specification') THEN
        ALTER TABLE products ADD COLUMN specification TEXT;
    END IF;
    
    -- Add updated_at column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'updated_at') THEN
        ALTER TABLE products ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL;
    END IF;
END $$;

-- Add indexes if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_slug') THEN
        CREATE INDEX idx_products_slug ON products(slug);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_is_featured') THEN
        CREATE INDEX idx_products_is_featured ON products(is_featured);
    END IF;
END $$;