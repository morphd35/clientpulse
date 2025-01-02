import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { AuthService } from '../services/auth.service';
import type { SignUpFormData, SignInFormData } from '../types/auth.types';
import type { User } from '@supabase/supabase-js';

const authService = new AuthService();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (data: SignInFormData) => {
    try {
      setError(null);
      const { user } = await authService.signIn(data);
      navigate('/');
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    }
  };

  const signUp = async (data: SignUpFormData) => {
    try {
      setError(null);
      const { user } = await authService.signUp(data);
      navigate('/signin');
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      navigate('/signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };
}