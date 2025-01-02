import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import AccountList from './components/AccountList';
import AccountSearch from './components/AccountSearch';
import AccountTypeFilter from './components/AccountTypeFilter';
import { AccountType } from '../../types/account';
import { exportAccountsToCSV } from '../../utils/export';
import { AccountService } from '../../services/account/account.service';

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AccountType | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const accounts = await AccountService.getAllAccounts();
      exportAccountsToCSV(accounts);
    } catch (error) {
      console.error('Error exporting accounts:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your business contacts and track customer relationships
              </p>
            </div>
            
            {/* Action Buttons - Stack vertically on mobile */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
              <Link
                to="/accounts/new"
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 w-full sm:w-auto"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                New Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <AccountSearch value={searchQuery} onChange={setSearchQuery} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <AccountTypeFilter value={selectedType} onChange={setSelectedType} />
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full sm:w-auto"
            >
              <FunnelIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <AccountList 
          searchQuery={searchQuery} 
          accountType={selectedType}
        />
      </div>
    </div>
  );
}