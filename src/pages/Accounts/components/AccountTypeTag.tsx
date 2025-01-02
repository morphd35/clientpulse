import { AccountType } from '../../../types/account';

const typeStyles = {
  active: 'bg-green-50 text-green-700 ring-green-600/20',
  prospect: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  inactive: 'bg-gray-50 text-gray-600 ring-gray-500/10',
};

interface AccountTypeTagProps {
  type: AccountType;
}

export default function AccountTypeTag({ type }: AccountTypeTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${typeStyles[type]}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}