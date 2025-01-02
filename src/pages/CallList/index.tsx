import { useEffect, useState } from 'react';
import { Account, AccountType } from '../../types/account';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../features/auth/hooks/useAuth';
import CallListTable from './components/CallListTable';
import CallListFilters from './components/CallListFilters';
import { SortConfig } from './types';

export default function CallList() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AccountType | 'all'>('all');
  const [daysThreshold, setDaysThreshold] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'daysSince',
    direction: 'desc'
  });

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user, daysThreshold]);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user?.id)
        .lt('last_contact_date', thresholdDate.toISOString());

      if (error) throw error;
      setAccounts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = !searchQuery || 
      account.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || account.account_type === selectedType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="text-center py-4">Loading call list...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Call List</h1>
          <p className="mt-2 text-sm text-gray-700">
            Accounts that haven't been contacted in the last {daysThreshold} days
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <CallListFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          daysThreshold={daysThreshold}
          onDaysThresholdChange={setDaysThreshold}
        />

        {filteredAccounts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No accounts found matching your criteria</p>
          </div>
        ) : (
          <CallListTable
            accounts={filteredAccounts}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </div>
    </div>
  );
}