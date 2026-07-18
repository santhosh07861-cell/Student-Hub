import { supabase } from './supabase';

/**
 * Retrieves the user profile.
 * Falls back to localStorage if the database table does not exist.
 */
export const getProfile = async (userId) => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Table doesn't exist error (PGRST205 or similar)
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        console.warn('Supabase profiles table does not exist. Falling back to localStorage.');
        return getLocalProfile(userId);
      }
      // No rows found error (PGRST116) is normal for new profiles
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error fetching profile from Supabase, trying localStorage fallback:', err);
    return getLocalProfile(userId);
  }
};

/**
 * Updates or creates the user profile.
 * Falls back to localStorage if the database table does not exist.
 */
export const updateProfile = async (userId, profileData) => {
  if (!userId) throw new Error('User ID is required to update profile');

  const payload = {
    user_id: userId,
    full_name: profileData.full_name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    college: profileData.college || '',
    branch: profileData.branch || '',
    year: profileData.year || '',
    bio: profileData.bio || '',
    profile_photo: profileData.profile_photo || '',
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        console.warn('Supabase profiles table does not exist on update. Saving to localStorage.');
        return saveLocalProfile(userId, payload);
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error updating profile in Supabase, trying localStorage fallback:', err);
    return saveLocalProfile(userId, payload);
  }
};

// --- LocalStorage Fallback Helpers ---

const getLocalProfile = (userId) => {
  try {
    const saved = localStorage.getItem(`student_hub_profile_${userId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to load local profile:', e);
    return null;
  }
};

const saveLocalProfile = (userId, profileData) => {
  try {
    localStorage.setItem(`student_hub_profile_${userId}`, JSON.stringify(profileData));
    return profileData;
  } catch (e) {
    console.error('Failed to save local profile:', e);
    throw e;
  }
};
