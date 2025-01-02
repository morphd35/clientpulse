import { supabase } from '../../../lib/supabase';
import type { SignUpFormData, SignInFormData } from '../types/auth.types';

export class AuthService {
  async signIn({ email, password }: SignInFormData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  async signUp({ email, password, fullName }: SignUpFormData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null; // Return null instead of throwing to handle session expiry gracefully
    }
  }

  private getAuthErrorMessage(error: any): string {
    if (error?.message) {
      if (error.message.includes('Invalid login credentials')) {
        return 'Invalid email or password';
      }
      if (error.message.includes('Email rate limit exceeded')) {
        return 'Too many attempts. Please try again later.';
      }
      if (error.message.includes('User already registered')) {
        return 'An account with this email already exists';
      }
      if (error.message.includes('Network request failed')) {
        return 'Unable to connect. Please check your internet connection.';
      }
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}