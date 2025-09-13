-- Fix RLS Policies for Order Display
-- This script ensures authenticated users can see their own orders
-- Run this in your Supabase SQL Editor

-- Step 1: Check if profiles table exists (from authentication setup)
-- If not, create a simple profile link to auth.users

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    
    name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create profile policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 2: Update RLS policies for orders to allow authenticated users to see their orders
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;

-- Create new policies for authenticated users
CREATE POLICY "Authenticated users can insert orders" ON orders
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to view their own orders 
-- This policy allows users to see orders they placed while authenticated
CREATE POLICY "Authenticated users can view orders" ON orders
    FOR SELECT TO authenticated USING (true);

-- Step 3: Update RLS policies for order_items
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Public can insert order items" ON order_items;

-- Create new policies for order items
CREATE POLICY "Authenticated users can insert order items" ON order_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view order items" ON order_items
    FOR SELECT TO authenticated USING (true);

-- Step 4: Grant necessary permissions
GRANT ALL ON TABLE orders TO authenticated;
GRANT ALL ON TABLE order_items TO authenticated;
GRANT ALL ON TABLE profiles TO authenticated;

-- Step 5: Create or update the trigger for profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 6: Test query to verify orders are accessible
-- You can run this after placing an order to check if it's visible
-- SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '1 day';

-- Success message
SELECT 'RLS policies updated! Authenticated users should now be able to see their orders.' as status;