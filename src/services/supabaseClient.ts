import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

/**
 * Checks whether the Supabase environment variables have been filled in
 * with non-placeholder values.
 */
export const isSupabaseConfigured = (): boolean => {
  const hasUrl = Boolean(rawUrl) && !rawUrl.includes('your-project-id');
  const hasKey = Boolean(rawKey) && !rawKey.includes('your-supabase-publishable');
  return hasUrl && hasKey;
};

/**
 * Safe fallback values used strictly during local development when credentials
 * have not yet been provided, preventing initialization runtime exceptions.
 */
const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackKey = 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? rawUrl : fallbackUrl,
  isSupabaseConfigured() ? rawKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

/**
 * Diagnostic helper to inspect Supabase configuration status without exposing sensitive keys.
 */
export const getSupabaseConfigStatus = (): {
  isConfigured: boolean;
  projectUrl: string;
  hasKey: boolean;
  message: string;
} => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    projectUrl: configured ? rawUrl : '(not configured)',
    hasKey: Boolean(rawKey && !rawKey.includes('your-supabase-publishable')),
    message: configured
      ? 'Supabase environment variables detected.'
      : 'Supabase credentials missing or set to default placeholders in .env.local.'
  };
};

/**
 * Verifies live connectivity with the Supabase project by probing the Auth session endpoint.
 * Does not write data or require specific tables.
 */
export const verifySupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured yet. Please supply valid credentials in .env.local.'
    };
  }

  const startTime = Date.now();
  try {
    const { error } = await supabase.auth.getSession();
    const latencyMs = Date.now() - startTime;

    if (error) {
      return {
        success: false,
        message: `Supabase responded with an error: ${error.message}`,
        latencyMs
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase (${latencyMs}ms).`,
      latencyMs
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Failed to connect to Supabase: ${errorMsg}`
    };
  }
};

