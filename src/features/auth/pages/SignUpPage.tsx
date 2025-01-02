import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import type { SignUpFormData, AuthError } from '../types/auth.types';
import { validateEmail, validatePassword } from '../utils/validation';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  const validateForm = (): boolean => {
    // Reset previous errors
    setError(null);

    // Validate full name
    if (!formData.fullName.trim()) {
      setError({ message: 'Full name is required', field: 'fullName' });
      return false;
    }

    // Validate email
    if (!validateEmail(formData.email.trim())) {
      setError({ message: 'Invalid email address', field: 'email' });
      return false;
    }

    // Validate password
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError({ message: passwordErrors[0], field: 'password' });
      return false;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError({ message: 'Passwords do not match', field: 'confirmPassword' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      await authService.signUp(formData);
      
      navigate('/signin', { 
        state: { 
          message: 'Account created successfully. Please sign in.' 
        }
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError({ 
        message: err instanceof Error ? err.message : 'Failed to create account'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Full Name"
          value={formData.fullName}
          onChange={(value) => setFormData({ ...formData, fullName: value })}
          error={error?.field === 'fullName' ? error.message : undefined}
          required
        />
        <AuthInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          error={error?.field === 'email' ? error.message : undefined}
          required
        />
        <AuthInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          error={error?.field === 'password' ? error.message : undefined}
          required
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
          error={error?.field === 'confirmPassword' ? error.message : undefined}
          required
        />

        {error && !error.field && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}