import { useState, useEffect } from 'react';
import { ProfileService } from '../services/profile.service';
import type { Profile } from '../types/profile.types';
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
      const profile = await profileService.getProfile(user.id);
      setProfile(profile);
    } catch (err) {
      console.error('Profile error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await profileService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  if (!user) {
    throw new Error('User is null');
  }


  return { profile, loading, error, updateProfile };
}