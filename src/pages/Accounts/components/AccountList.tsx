import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Account, AccountType } from '../../../types/account';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import AccountTypeTag from './AccountTypeTag';
import DeleteAccountModal from './DeleteAccountModal';
import { PhoneIcon, EnvelopeIcon, PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/20/solid';
import { formatAddress } from '../../../utils/address';

interface AccountListProps {
  searchQuery: string;
  accountType: AccountType | 'all';
}

export default function AccountList({ searchQuery, accountType }: AccountListProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user, accountType, searchQuery]);

  async function fetchAccounts() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user?.id)
        .order('business_name', { ascending: true });

      if (accountType !== 'all') {
        query = query.eq('account_type', accountType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      let filteredData = data || [];
      
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        filteredData = filteredData.filter(account => 
          account.business_name.toLowerCase().includes(search) ||
          account.contact_name?.toLowerCase().includes(search)
        );
      }

      setAccounts(filteredData);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete || !user) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountToDelete.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAccounts(accounts.filter(a => a.id !== accountToDelete.id));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setAccountToDelete(null);
    }
  };

  const handleScheduleAppointment = (account: Account) => {
    navigate('/appointments', { state: { selectedAccount: account } });
  };

  if (loading) {
    return <div className="text-center py-4">Loading accounts...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No accounts found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{account.business_name}</div>
                  {account.contact_name && (
                    <div className="text-sm text-gray-600">{account.contact_name}</div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    {formatAddress(account)}
                  </div>
                </div>
                <AccountTypeTag type={account.account_type} />
              </div>
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <div className="text-sm text-gray-500">
                  Last Contact: {format(new Date(account.last_contact_date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleScheduleAppointment(account)}
                    className="text-green-600 hover:text-green-900"
                    title="Schedule appointment"
                  >
                    <CalendarIcon className="h-5 w-5" />
                  </button>
                  <Link
                    to={`/accounts/${account.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(account)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Business Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Contact
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Last Contact
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                  <div className="font-medium text-gray-900">{account.business_name}</div>
                  <div className="mt-1 text-gray-500">
                    {formatAddress(account)}
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{account.contact_name}</div>
                  <div className="mt-1 flex items-center gap-x-2">
                    {account.phone && (
                      <a href={`tel:${account.phone}`} className="flex items-center gap-x-1 text-gray-500 hover:text-gray-900">
                        <PhoneIcon className="h-4 w-4" />
                        {account.phone}
                      </a>
                    )}
                    {account.email && (
                      <a href={`mailto:${account.email}`} className="flex items-center gap-x-1 text-gray-500 hover:text-gray-900">
                        <EnvelopeIcon className="h-4 w-4" />
                        {account.email}
                      </a>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <AccountTypeTag type={account.account_type} />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(new Date(account.last_contact_date), 'MMM d, yyyy')}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleScheduleAppointment(account)}
                      className="text-green-600 hover:text-green-900"
                      title="Schedule appointment"
                    >
                      <CalendarIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Schedule appointment for {account.business_name}</span>
                    </button>
                    <Link
                      to={`/accounts/${account.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit {account.business_name}</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(account)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Delete {account.business_name}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteAccountModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        accountName={accountToDelete?.business_name}
        isDeleting={isDeleting}
      />
    </>
  );
}