import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import type { SignInFormData, AuthError } from '../types/auth.types';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  // Show success message if redirected from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const { email, password } = formData;
      if (!email.trim() || !password) {
        setError({ message: 'Please enter both email and password' });
        return;
      }

      await authService.signIn(formData);
      navigate('/');
    } catch (err) {
      console.error('Sign in error:', err);
      setError({ 
        message: err instanceof Error ? err.message : 'Failed to sign in. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <AuthInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          required
        />
        <AuthInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          required
        />

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}