-- Create Wishlist Table in Supabase
-- Run this in your Supabase SQL Editor

-- Step 1: Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    
    -- Foreign keys
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    
    -- Prevent duplicate entries for same user-product combination
    UNIQUE(user_id, product_id)
);

-- Step 2: Create indexes for better performance
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);
CREATE INDEX idx_wishlist_user_product ON wishlist(user_id, product_id);

-- Step 3: Enable Row Level Security
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for wishlist
-- Users can only see their own wishlist items
CREATE POLICY "Users can view own wishlist" ON wishlist
    FOR SELECT USING (auth.uid() = user_id);

-- Users can add items to their own wishlist
CREATE POLICY "Users can insert own wishlist items" ON wishlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove items from their own wishlist
CREATE POLICY "Users can delete own wishlist items" ON wishlist
    FOR DELETE USING (auth.uid() = user_id);

-- Step 5: Grant permissions
GRANT ALL ON TABLE wishlist TO authenticated;

-- Step 6: Create a function to toggle wishlist items
CREATE OR REPLACE FUNCTION toggle_wishlist_item(product_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    item_exists BOOLEAN;
BEGIN
    -- Check if the item already exists in user's wishlist
    SELECT EXISTS(
        SELECT 1 FROM wishlist 
        WHERE user_id = auth.uid() AND product_id = product_uuid
    ) INTO item_exists;
    
    IF item_exists THEN
        -- Remove from wishlist
        DELETE FROM wishlist 
        WHERE user_id = auth.uid() AND product_id = product_uuid;
        RETURN FALSE; -- Removed
    ELSE
        -- Add to wishlist
        INSERT INTO wishlist (user_id, product_id) 
        VALUES (auth.uid(), product_uuid);
        RETURN TRUE; -- Added
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create a function to get user's wishlist with product details
CREATE OR REPLACE FUNCTION get_user_wishlist()
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    product_id UUID,
    product_name TEXT,
    product_slug TEXT,
    product_price NUMERIC,
    product_original_price NUMERIC,
    product_category TEXT,
    product_images TEXT[],
    product_description TEXT,
    product_specification TEXT,
    product_size TEXT,
    product_is_featured BOOLEAN,
    product_ai_hint TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.created_at,
        w.product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.price as product_price,
        p.original_price as product_original_price,
        p.category::TEXT as product_category,
        p.images as product_images,
        p.description as product_description,
        p.specification as product_specification,
        p.size as product_size,
        p.is_featured as product_is_featured,
        p.ai_hint as product_ai_hint
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = auth.uid()
    ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Wishlist table and functions created successfully!' as status;