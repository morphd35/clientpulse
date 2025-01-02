-- Check if appointments table exists and create if not
DO $$ 
BEGIN
    -- Create appointments table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
        CREATE TABLE appointments (
            id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id) NOT NULL,
            date TIMESTAMPTZ NOT NULL,
            duration INTEGER NOT NULL CHECK (duration >= 15),
            type TEXT NOT NULL CHECK (type IN ('sales', 'follow-up', 'introduction')),
            notes TEXT,
            status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    -- Create updated_at trigger if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'appointments_updated_at'
    ) THEN
        CREATE TRIGGER appointments_updated_at
            BEFORE UPDATE ON appointments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    END IF;

    -- Enable RLS
    ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Users can read own appointments" ON appointments;
    DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
    DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
    DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

    -- Create RLS policies
    CREATE POLICY "Users can read own appointments"
        ON appointments FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());

    CREATE POLICY "Users can insert own appointments"
        ON appointments FOR INSERT
        TO authenticated
        WITH CHECK (user_id = auth.uid());

    CREATE POLICY "Users can update own appointments"
        ON appointments FOR UPDATE
        TO authenticated
        USING (user_id = auth.uid());

    CREATE POLICY "Users can delete own appointments"
        ON appointments FOR DELETE
        TO authenticated
        USING (user_id = auth.uid());

    -- Create indexes if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_appointments_user_id') THEN
        CREATE INDEX idx_appointments_user_id ON appointments(user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_appointments_account_id') THEN
        CREATE INDEX idx_appointments_account_id ON appointments(account_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_appointments_date') THEN
        CREATE INDEX idx_appointments_date ON appointments(date);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_appointments_status') THEN
        CREATE INDEX idx_appointments_status ON appointments(status);
    END IF;

END $$;