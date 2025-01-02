import { useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Account } from '../../../types/account';
import QuickActionButtons from '../../../components/QuickActionButtons';
import { SortConfig } from '../types';
import SortableHeader from './SortableHeader';

interface CallListTableProps {
  accounts: Account[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export default function CallListTable({ accounts, sortConfig, onSort }: CallListTableProps) {
  const navigate = useNavigate();

  const sortedAccounts = useMemo(() => {
    const sorted = [...accounts];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (sortConfig.key === 'daysSince') {
          const daysA = a.last_contact_date
            ? differenceInDays(new Date(), new Date(a.last_contact_date))
            : Infinity;
          const daysB = b.last_contact_date
            ? differenceInDays(new Date(), new Date(b.last_contact_date))
            : Infinity;
          return sortConfig.direction === 'asc' ? daysA - daysB : daysB - daysA;
        }

        if (sortConfig.key === 'last_contact_date') {
          if (!a.last_contact_date || !b.last_contact_date) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          return sortConfig.direction === 'asc'
            ? new Date(a.last_contact_date).getTime() - new Date(b.last_contact_date).getTime()
            : new Date(b.last_contact_date).getTime() - new Date(a.last_contact_date).getTime();
        }

        const aValue = a[sortConfig.key as keyof Account];
        const bValue = b[sortConfig.key as keyof Account];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [accounts, sortConfig]);

  if (sortedAccounts.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No accounts available to display.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader
              label="Business Name"
              sortKey="business_name"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Contact Name"
              sortKey="contact_name"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Last Contact"
              sortKey="last_contact_date"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <SortableHeader
              label="Days Since Contact"
              sortKey="daysSince"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <th className="relative py-3.5 pl-3 pr-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedAccounts.map((account) => (
            <tr key={account.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {account.business_name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {account.contact_name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {account.last_contact_date
                  ? format(new Date(account.last_contact_date), 'MMM d, yyyy')
                  : 'N/A'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {account.last_contact_date
                  ? `${differenceInDays(new Date(), new Date(account.last_contact_date))} days`
                  : 'N/A'}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                <QuickActionButtons
                  phone={account.phone || ''}
                  email={account.email || ''}
                  onSchedule={() =>
                    navigate('/appointments', { state: { selectedAccount: account } })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
