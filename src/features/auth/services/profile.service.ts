import { supabase } from '../../../lib/supabase';
import type { Profile, ProfileFormData } from '../types/profile.types';

export class ProfileService {
  async getProfile(userId: string): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            return this.createProfile(user.id, {
              full_name: user.user_metadata?.full_name || '',
              email: user.email || ''
            });
          }
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: ProfileFormData): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async createProfile(userId: string, profile: ProfileFormData): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          ...profile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) {
        // If profile already exists, try to update it
        if (error.code === '23505') {
          return this.updateProfile(userId, profile);
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }
}