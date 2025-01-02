import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plqaijyafkqxyprvcaar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscWFpanlhZmtxeHlwcnZjYWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTEzMTEsImV4cCI6MjA1MTMyNzMxMX0.l_QtRxcicCacI357WOxAgZCzDjz38miVHaA1Zp0A7Xc';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});