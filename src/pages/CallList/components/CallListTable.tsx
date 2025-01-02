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
          const daysA = differenceInDays(new Date(), new Date(a.last_contact_date));
          const daysB = differenceInDays(new Date(), new Date(b.last_contact_date));
          return sortConfig.direction === 'asc' ? daysA - daysB : daysB - daysA;
        }
        
        if (sortConfig.key === 'last_contact_date') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.last_contact_date).getTime() - new Date(b.last_contact_date).getTime()
            : new Date(b.last_contact_date).getTime() - new Date(a.last_contact_date).getTime();
        }
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [accounts, sortConfig]);

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
                {format(new Date(account.last_contact_date), 'MMM d, yyyy')}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {differenceInDays(new Date(), new Date(account.last_contact_date))} days
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                <QuickActionButtons
                  phone={account.phone}
                  email={account.email}
                  onSchedule={() => navigate('/appointments', { state: { selectedAccount: account } })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}