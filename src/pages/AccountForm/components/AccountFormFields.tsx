import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Account, AccountType } from '../../../types/account';
import AddressAutocomplete from '../../../components/AddressAutocomplete';
import type { Address } from '../../../types/address';

interface AccountFormFieldsProps {
  account: Partial<Account>;
  onSubmit: (data: Partial<Account>) => void;
  isSubmitting: boolean;
}

const accountTypes: { value: AccountType; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'inactive', label: 'Inactive' },
];

export default function AccountFormFields({ account, onSubmit, isSubmitting }: AccountFormFieldsProps) {
  const [formData, setFormData] = useState({
    business_name: account.business_name || '',
    contact_name: account.contact_name || '',
    phone: account.phone || '',
    email: account.email || '',
    notes: account.notes || '',
    account_type: account.account_type || 'prospect' as AccountType,
    street_address: account.street_address || '',
    city: account.city || '',
    state: account.state || '',
    zip_code: account.zip_code || '',
    latitude: account.latitude || null,
    longitude: account.longitude || null
  });

  function handleAddressChange(addressData: Partial<Address>) {
    setFormData(prev => ({
      ...prev,
      street_address: addressData.street_address || '',
      city: addressData.city || '',
      state: addressData.state || '',
      zip_code: addressData.zip_code || '',
      latitude: addressData.latitude || null,
      longitude: addressData.longitude || null
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...formData,
      last_contact_date: new Date().toISOString()
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="business_name" className="block text-sm font-medium leading-6 text-gray-900">
            Business Name *
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="business_name"
              id="business_name"
              required
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium leading-6 text-gray-900">
            Contact Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="contact_name"
              id="contact_name"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
            Phone
          </label>
          <div className="mt-2">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Address
          </label>
          <div className="mt-2">
            <AddressAutocomplete
              value={{
                street_address: formData.street_address,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zip_code,
                latitude: formData.latitude,
                longitude: formData.longitude
              }}
              onChange={handleAddressChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="account_type" className="block text-sm font-medium leading-6 text-gray-900">
            Account Type *
          </label>
          <div className="mt-2">
            <select
              id="account_type"
              name="account_type"
              required
              value={formData.account_type}
              onChange={(e) => setFormData({ ...formData, account_type: e.target.value as AccountType })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              {accountTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
            Notes
          </label>
          <div className="mt-2">
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          to="/accounts"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}