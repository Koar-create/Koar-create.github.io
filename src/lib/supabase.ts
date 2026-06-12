import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export type CommentRow = {
  id: string;
  slug: string;
  lang: string;
  user_id: string;
  author_name: string | null;
  body: string;
  parent_id: string | null;
  created_at: string;
  is_approved: boolean;
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  updated_at: string;
};
