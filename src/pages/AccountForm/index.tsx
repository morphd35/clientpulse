import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Account } from '../../types/account';
import { supabase } from '../../lib/supabase';
import AccountFormFields from './components/AccountFormFields';
import DeleteAccountModal from './components/DeleteAccountModal';

export default function AccountForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [account, setAccount] = useState<Partial<Account>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchAccount(parseInt(id));
    }
  }, [id, user]);

  async function fetchAccount(accountId: number) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) setAccount(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching account');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: Partial<Account>) {
    if (!user) {
      setError('You must be logged in to perform this action');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const accountData = {
        ...formData,
        user_id: user.id,
        last_contact_date: new Date().toISOString()
      };

      if (id) {
        const { error } = await supabase
          .from('accounts')
          .update(accountData)
          .eq('id', id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('accounts')
          .insert([accountData]);
        if (error) throw error;
      }

      navigate('/accounts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving account');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!user || !id) return;

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Close the modal and navigate away
      setShowDeleteModal(false);
      navigate('/accounts', { replace: true });
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Error deleting account');
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !showDeleteModal) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {id ? 'Edit Account' : 'New Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {id ? 'Update account information' : 'Create a new account'}
          </p>
        </div>
        {id && (
          <div className="mt-4 sm:ml-16 sm:mt-0">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8">
        <AccountFormFields
          account={account}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </div>

      <DeleteAccountModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        accountName={account.business_name}
        isDeleting={loading}
      />
    </div>
  );
}