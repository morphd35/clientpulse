import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { AccountType } from '../../../types/account';

const accountTypes = [
  { value: 'all', label: 'All accounts' },
  { value: 'active', label: 'Active' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'inactive', label: 'Inactive' },
] as const;

interface AccountTypeFilterProps {
  value: AccountType | 'all';
  onChange: (value: AccountType | 'all') => void;
}

export default function AccountTypeFilter({ value, onChange }: AccountTypeFilterProps) {
  const selectedType = accountTypes.find((type) => type.value === value);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        {selectedType?.label}
        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {accountTypes.map((type) => (
              <Menu.Item key={type.value}>
                {({ active }) => (
                  <button
                    onClick={() => onChange(type.value)}
                    className={`
                      ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                      ${value === type.value ? 'font-medium' : ''}
                      block w-full px-4 py-2 text-left text-sm
                    `}
                  >
                    {type.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}