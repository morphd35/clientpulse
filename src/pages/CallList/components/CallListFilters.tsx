import { AccountType } from '../../../types/account';

interface CallListFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: AccountType | 'all';
  onTypeChange: (type: AccountType | 'all') => void;
  daysThreshold: number;
  onDaysThresholdChange: (days: number) => void;
}

export default function CallListFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  daysThreshold,
  onDaysThresholdChange
}: CallListFiltersProps) {
  return (
    <div className="space-y-4 sm:flex sm:items-center sm:space-x-4 sm:space-y-0 bg-white p-4 rounded-lg shadow">
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">Search accounts</label>
        <input
          type="search"
          id="search"
          placeholder="Search accounts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="sm:w-48">
        <label htmlFor="account-type" className="sr-only">Account Type</label>
        <select
          id="account-type"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as AccountType | 'all')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">All Types</option>
          <option value="active">Active</option>
          <option value="prospect">Prospect</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="sm:w-64">
        <label htmlFor="days-threshold" className="sr-only">Days Since Contact</label>
        <select
          id="days-threshold"
          value={daysThreshold}
          onChange={(e) => onDaysThresholdChange(Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={7}>Past 7 days</option>
          <option value={10}>Past 10 days</option>
          <option value={14}>Past 14 days</option>
          <option value={30}>Past 30 days</option>
          <option value={60}>Past 60 days</option>
        </select>
      </div>
    </div>
  );
}