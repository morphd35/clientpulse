import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { SortConfig } from '../types';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export default function SortableHeader({ label, sortKey, sortConfig, onSort }: SortableHeaderProps) {
  const isSorted = sortConfig.key === sortKey;
  
  return (
    <th
      scope="col"
      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-x-2">
        <span>{label}</span>
        <span className="flex-none rounded">
          {isSorted && (
            sortConfig.direction === 'asc' 
              ? <ChevronUpIcon className="h-4 w-4" />
              : <ChevronDownIcon className="h-4 w-4" />
          )}
        </span>
      </div>
    </th>
  );
}