-- Supabase Authentication Setup
-- Run this in your Supabase SQL Editor to set up authentication properly

-- 1. Ensure auth schema is enabled (usually enabled by default)
-- This should already be available in your Supabase project

-- 2. Create a user profiles table to store additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  email TEXT
);

-- 3. Set up Row Level Security (RLS) for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for profiles table
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Create a trigger to automatically create a profile when a user signs up
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

-- 6. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Update RLS policies for orders to use authenticated users
-- Allow authenticated users to insert orders
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Authenticated users can insert orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to view their own orders by email/phone
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT TO authenticated USING (
    customer_phone = (SELECT phone FROM profiles WHERE id = auth.uid()) OR
    customer_name = (SELECT name FROM profiles WHERE id = auth.uid())
  );

-- 8. Update RLS policies for order_items
DROP POLICY IF EXISTS "Public can insert order items" ON order_items;
CREATE POLICY "Authenticated users can insert order items" ON order_items
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (
        orders.customer_phone = (SELECT phone FROM profiles WHERE id = auth.uid()) OR
        orders.customer_name = (SELECT name FROM profiles WHERE id = auth.uid())
      )
    )
  );

-- 9. Create a function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile()
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.email, p.phone, p.avatar_url, p.created_at
  FROM profiles p
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON TABLE auth.users TO authenticated;
GRANT ALL ON TABLE profiles TO authenticated;

-- Note: Make sure to configure your Supabase project settings:
-- 1. Go to Authentication > Settings in your Supabase dashboard
-- 2. Set your site URL to: http://localhost:3000 (for development)
-- 3. Add redirect URLs for password reset: http://localhost:3000/auth/reset-password
-- 4. Configure email templates if needed
-- 5. Enable the authentication providers you want to use