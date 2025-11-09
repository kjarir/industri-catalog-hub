import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtaarndtwyxdsqlkepir.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YWFybmR0d3l4ZHNxbGtlcGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NjcxNjMsImV4cCI6MjA3ODI0MzE2M30.OMgWum0IV62xX-MDVP0FiBA5gKSFEGYQ_1m4rti2qgg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
