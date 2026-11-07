import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User, UserRole, DatabaseRole } from '../types';
import { StorageService } from './storageService';

export interface AuthResponse {
  user: User | null;
  needsEmailConfirmation?: boolean;
  error: string | null;
}

/**
 * Normalizes a database role or user metadata role into an application UserRole.
 * Distinguishes between 'coordinator' (dispatch & QA operations) and 'platform_admin'
 * (system-wide governance & commissioner office).
 */
export const normalizeRole = (rawRole?: string): UserRole => {
  if (!rawRole) return 'citizen';
  const r = rawRole.toLowerCase().trim();
  if (r === 'coordinator') return 'coordinator';
  if (r === 'platform_admin') return 'platform_admin';
  if (r === 'admin') return 'admin';
  if (r === 'authority') return 'authority';
  if (r === 'field_worker' || r === 'worker') return 'field_worker';
  return 'citizen';
};

/**
 * Converts a database profile record and Supabase Auth user into an application User object.
 */
export const mapProfileToUser = (profileData: any, authUser?: any): User => {
  const userId = profileData?.id || authUser?.id || `user-${Date.now()}`;
  const email = profileData?.email || authUser?.email || '';
  const fullName =
    profileData?.full_name ||
    profileData?.name ||
    authUser?.user_metadata?.full_name ||
    (email ? email.split('@')[0] : 'CivicSense User');

  const rawRole =
    profileData?.role ||
    authUser?.user_metadata?.role ||
    'citizen';

  const role = normalizeRole(rawRole);
  const databaseRole = (rawRole as DatabaseRole) || 'citizen';

  return {
    id: userId,
    name: fullName,
    email: email,
    phone: profileData?.phone || authUser?.user_metadata?.phone || '+91 90000 00000',
    role: role,
    databaseRole: databaseRole,
    departmentId: profileData?.department_id || profileData?.departmentId || undefined,
    ward: profileData?.ward || profileData?.jurisdiction || 'Central Zone',
    avatarUrl:
      profileData?.avatar_url ||
      profileData?.avatarUrl ||
      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    verifiedStatus: profileData?.is_verified ?? true,
    active: profileData?.is_active ?? true,
    joinedDate: profileData?.created_at
      ? profileData.created_at.split('T')[0]
      : new Date().toISOString().split('T')[0]
  };
};

export const AuthService = {
  /**
   * Registers a new user. Enforces citizen role for public self-registration.
   * Privileged roles (authority, coordinator, field_worker, platform_admin)
   * cannot be claimed via public signup and must be provisioned administratively.
   */
  signUp: async (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    ward?: string;
  }): Promise<AuthResponse> => {
    if (!isSupabaseConfigured()) {
      return {
        user: null,
        error: 'Supabase credentials are not configured in .env.local.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            phone: params.phone?.trim() || '',
            ward: params.ward?.trim() || 'Central Zone',
            // Enforce citizen role strictly on frontend payload
            role: 'citizen'
          }
        }
      });

      if (error) {
        return {
          user: null,
          error: error.message
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'Unable to create user account. Please try again.'
        };
      }

      // If email confirmation is required, session will be null
      const needsEmailConfirmation = !data.session;

      const user = mapProfileToUser(
        {
          id: data.user.id,
          email: data.user.email,
          full_name: params.fullName,
          phone: params.phone,
          ward: params.ward,
          role: 'citizen'
        },
        data.user
      );

      if (!needsEmailConfirmation) {
        StorageService.saveUser(user);
        StorageService.setCurrentUser(user);
        StorageService.setCurrentRole('citizen');
      }

      return {
        user,
        needsEmailConfirmation,
        error: null
      };
    } catch (err: any) {
      return {
        user: null,
        error: err.message || 'An unexpected error occurred during signup.'
      };
    }
  },

  /**
   * Signs in an existing user with email and password.
   * Fetches their role and profile from public.profiles.
   */
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    if (!isSupabaseConfigured()) {
      return {
        user: null,
        error: 'Supabase credentials are not configured in .env.local.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        return {
          user: null,
          error: error.message
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'Authentication failed. No user record returned.'
        };
      }

      // Attempt to load profile from public.profiles table
      const profile = await AuthService.fetchUserProfile(data.user.id, data.user);
      StorageService.saveUser(profile);
      StorageService.setCurrentUser(profile);
      StorageService.setCurrentRole(profile.role);

      return {
        user: profile,
        error: null
      };
    } catch (err: any) {
      return {
        user: null,
        error: err.message || 'An unexpected error occurred during sign in.'
      };
    }
  },

  /**
   * Loads profile row from public.profiles table for the authenticated user.
   * If the row does not exist (or RLS policy restricts reading before insert),
   * falls back safely to auth user metadata so the user is never locked out.
   */
  fetchUserProfile: async (userId: string, authUser?: any): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Could not query public.profiles (falling back to user_metadata):', error.message);
      }

      if (data) {
        return mapProfileToUser(data, authUser);
      }
    } catch (err) {
      console.warn('Exception querying public.profiles:', err);
    }

    // Fallback using authUser metadata
    return mapProfileToUser(
      {
        id: userId,
        email: authUser?.email,
        full_name: authUser?.user_metadata?.full_name,
        phone: authUser?.user_metadata?.phone,
        ward: authUser?.user_metadata?.ward,
        role: authUser?.user_metadata?.role || 'citizen'
      },
      authUser
    );
  },

  /**
   * Retrieves the current authenticated session and mapped User.
   */
  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        return null;
      }

      return await AuthService.fetchUserProfile(session.user.id, session.user);
    } catch {
      return null;
    }
  },

  /**
   * Sends a password reset recovery link to the user's email.
   */
  resetPassword: async (email: string): Promise<{ success: boolean; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials are not configured in .env.local.'
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        error: null
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'An error occurred while requesting password reset.'
      };
    }
  },

  /**
   * Completes a password reset by updating the authenticated user's password.
   * Invoked after the user clicks the recovery link in their email.
   */
  updatePassword: async (newPassword: string): Promise<{ success: boolean; error: string | null }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Supabase credentials are not configured in .env.local.'
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        error: null
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to update password.'
      };
    }
  },

  /**
   * Signs out the user from Supabase and resets active session.
   */
  signOut: async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error during Supabase signOut:', err);
      }
    }
  },

  /**
   * Subscribes to Supabase authentication state changes.
   */
  onAuthStateChange: (
    callback: (event: string, user: User | null) => void
  ): { unsubscribe: () => void } => {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = await AuthService.fetchUserProfile(session.user.id, session.user);
          callback(event, user);
        } else {
          callback(event, null);
        }
      }
    );

    return {
      unsubscribe: () => subscription.unsubscribe()
    };
  }
};

