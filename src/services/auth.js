import { supabase } from './supabase';

/**
 * Initiates the Google OAuth sign-in flow.
 * Redirects the user to the Google Consent Screen.
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Redirect back to the exact origin and path where the user was
      redirectTo: window.location.origin + window.location.pathname
    }
  });

  if (error) {
    console.error('Supabase Google sign-in error:', error);
    throw error;
  }

  return data;
};

/**
 * Signs out the currently authenticated user.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Supabase sign-out error:', error);
    throw error;
  }
};

/**
 * Gets the current active session.
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Supabase getSession error:', error);
    throw error;
  }
  return session;
};

/**
 * Gets the current authenticated user's details.
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Supabase getUser error:', error);
    throw error;
  }
  return user;
};
