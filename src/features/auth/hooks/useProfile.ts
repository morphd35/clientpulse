import { useState, useEffect } from 'react';
import { ProfileService } from '../services/profile.service';
import type { Profile, ProfileFormData } from '../types/profile.types';
import { useAuth } from './useAuth';

const profileService = new ProfileService();

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  async function fetchProfile() {
    try {

      setLoading(true);
      setError(null);
      if (!user) throw new Error('No Authenticated User');

      const fetchedProfile = await profileService.getProfile(user.id);
      setProfile(fetchedProfile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: ProfileFormData) {
    if (!user) {
      throw new Error('No Authenticated User')
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedProfile = await profileService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err; // Re-throw error for further handling if needed
    } finally {
      setLoading(false);
    }
  }

  return { profile, loading, error, updateProfile };
}
