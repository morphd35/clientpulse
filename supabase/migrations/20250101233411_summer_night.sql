/*
  # Update accounts table with detailed address fields

  1. Changes
    - Split address field into street_address, city, state, zip_code
    - Add NOT NULL constraint to user_id
    - Update RLS policies to enforce user ownership

  2. Security
    - Enforce user_id requirement
    - Update RLS policies for better security
*/

-- Update address fields
ALTER TABLE accounts 
  DROP COLUMN IF EXISTS address,
  ADD COLUMN IF NOT EXISTS street_address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Make user_id required
ALTER TABLE accounts 
  ALTER COLUMN user_id SET NOT NULL;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can read own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can insert own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;

-- Create stricter RLS policies
CREATE POLICY "Users can read own accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    business_name IS NOT NULL AND
    user_id IS NOT NULL
  );

CREATE POLICY "Users can update own accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    business_name IS NOT NULL
  );

-- Add indexes for address fields
CREATE INDEX IF NOT EXISTS idx_accounts_city ON accounts(city);
CREATE INDEX IF NOT EXISTS idx_accounts_state ON accounts(state);
CREATE INDEX IF NOT EXISTS idx_accounts_zip_code ON accounts(zip_code);