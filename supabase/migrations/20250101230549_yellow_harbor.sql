/*
  # Add user_id and update RLS policies
  
  1. Changes
    - Add user_id column to accounts table
    - Update RLS policies to restrict access based on user_id
  
  2. Security
    - Modify existing RLS policies to check user_id
    - Ensure users can only access their own accounts
*/

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE accounts ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON accounts;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON accounts;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON accounts;

-- Create new RLS policies with user_id checks
CREATE POLICY "Users can read own accounts"
    ON accounts FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
    ON accounts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
    ON accounts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);