/*
  # Add Delete Policy for Accounts

  1. Changes
    - Add RLS policy for deleting accounts
    - Ensure user can only delete their own accounts
*/

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Users can delete own accounts" ON accounts;

-- Create delete policy
CREATE POLICY "Users can delete own accounts"
    ON accounts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);