import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  'https://knykelyweiuslgfljiir.supabase.co';

const supabaseAnonKey = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueWtlbHl3ZWl1c2xnZmxqaWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzQwMjIsImV4cCI6MjEwMzg1MDAyMn0.QSfOVwU8eZ6C6GmzuyHL0TITogokSxl29pZqICHUxhc';

// Clean up stale Supabase session tokens from localStorage to prevent background auto-refresh network loops
if (typeof window !== 'undefined') {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase.auth.token'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    // Ignore storage access errors in restricted contexts
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
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

    return { data, error };
  } catch (err: any) {
    console.warn('[SupabaseClient] Google sign-in network error:', err?.message);
    return { data: null, error: err };
  }
}
