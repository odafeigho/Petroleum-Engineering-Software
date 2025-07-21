import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Singleton browser/client Supabase instance
 * – Created lazily to avoid throwing at import-time
 * – Throws a clear error when the required env vars are missing
 */
let _supabase: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnon) {
    throw new Error(
      "Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY are required but were not found.",
    )
  }

  _supabase = createClient(supabaseUrl, supabaseAnon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return _supabase
}
