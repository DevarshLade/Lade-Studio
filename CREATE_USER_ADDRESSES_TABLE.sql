-- User Addresses Table
-- Run this in your Supabase SQL Editor to create the addresses functionality

-- Step 1: Create addresses table
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    
    -- User reference
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Address information
    label TEXT NOT NULL, -- e.g., 'Home', 'Work', 'Office'
    full_name TEXT NOT NULL,
    phone TEXT,
    
    -- Address details
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    
    -- Address preferences
    is_default BOOLEAN DEFAULT false,
    
    -- Ensure user doesn't have duplicate labels
    UNIQUE(user_id, label)
);

-- Step 2: Create indexes for better performance
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_is_default ON user_addresses(is_default);

-- Step 3: Create function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting this address as default, unset all other defaults for this user
    IF NEW.is_default = true THEN
        UPDATE user_addresses 
        SET is_default = false 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger for default address management
CREATE TRIGGER trigger_ensure_single_default_address
    BEFORE INSERT OR UPDATE ON user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_address();

-- Step 5: Enable Row Level Security
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for user addresses
-- Users can only see their own addresses
CREATE POLICY "Users can view own addresses" ON user_addresses
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses" ON user_addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses" ON user_addresses
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses" ON user_addresses
    FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Grant permissions
GRANT ALL ON TABLE user_addresses TO authenticated;

-- Step 8: Create function to get user's default address
CREATE OR REPLACE FUNCTION get_user_default_address(user_uuid UUID)
RETURNS TABLE(
    id UUID,
    label TEXT,
    full_name TEXT,
    phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    country TEXT
) 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ua.id,
        ua.label,
        ua.full_name,
        ua.phone,
        ua.address_line1,
        ua.address_line2,
        ua.city,
        ua.state,
        ua.pincode,
        ua.country
    FROM user_addresses ua
    WHERE ua.user_id = user_uuid AND ua.is_default = true
    LIMIT 1;
END;
$$;

-- Step 9: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_default_address TO authenticated;

-- Success message
SELECT 'User addresses table created successfully! Users can now save and manage multiple addresses.' as message;