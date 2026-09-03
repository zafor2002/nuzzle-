import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  'https://knykelyweiuslgfljiir.supabase.co';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueWtlbHl3ZWl1c2xnZmxqaWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzQwMjIsImV4cCI6MjEwMzg1MDAyMn0.QSfOVwU8eZ6C6GmzuyHL0TITogokSxl29pZqICHUxhc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Trigger Google OAuth 2.0 Sign-In via Supabase
 */
export async function signInWithGoogle() {
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error };
}
