/*
  # Update accounts table and policies
  
  1. Changes
    - Remove owner_email column and replace with user_id
    - Update RLS policies to use user_id
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing profiles table and related objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP TABLE IF EXISTS profiles;

-- Update accounts table to use user_id
ALTER TABLE accounts
    DROP COLUMN IF EXISTS owner_email,
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update RLS policies for accounts
DROP POLICY IF EXISTS "Users can read own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can insert own accounts" ON accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;

CREATE POLICY "Users can read own accounts"
    ON accounts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own accounts"
    ON accounts FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own accounts"
    ON accounts FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);