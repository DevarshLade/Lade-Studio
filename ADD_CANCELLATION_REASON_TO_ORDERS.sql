-- Add cancellation_reason field to orders table
-- Run this in your Supabase SQL Editor

-- Add the cancellation_reason column to the orders table
ALTER TABLE orders 
ADD COLUMN cancellation_reason TEXT;

-- Create an index on the cancellation_reason column for better performance
CREATE INDEX IF NOT EXISTS idx_orders_cancellation_reason ON orders(cancellation_reason);

-- Add a comment to document the new column
COMMENT ON COLUMN orders.cancellation_reason IS 'Reason provided by customer when cancelling an order';

-- Test the schema change by checking the table structure
-- You can run this to verify the column was added successfully:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'orders';