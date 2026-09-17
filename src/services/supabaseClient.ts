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
    autoRefreshToken: false, // Disabled background loop to prevent network spam when Supabase pauses
    detectSessionInUrl: true, // Crucial for OAuth callback detection from Google redirect
  },
});

/**
 * Trigger Google OAuth 2.0 Sign-In via Supabase
 */
export async function signInWithGoogle() {
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  
  try {
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

    if (error) {
      console.warn('[SupabaseClient] Google OAuth request error:', error.message);
      return { data: null, error };
    }

    // Crucial: Explicitly navigate the browser to Google's authentication consent screen
    if (data?.url && typeof window !== 'undefined') {
      window.location.href = data.url;
    }

    return { data, error: null };
  } catch (err: any) {
    console.warn('[SupabaseClient] Google OAuth network error:', err?.message);
    return { data: null, error: err };
  }
}
