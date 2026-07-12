import { createClient } from '@supabase/supabase-js';

// Securely access Vercel environment variables or local caches
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Export initialized connection client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);