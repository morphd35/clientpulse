import { useState } from 'react';
import { Account, AccountType } from '../../../types/account';
import AddressInput from '../../../components/AddressInput';
import type { Address } from '../../../types/address';

interface NewContactFormProps {
  onSave: (contact: Account) => void;
  onCancel: () => void;
}

export default function NewContactForm({ onSave, onCancel }: NewContactFormProps) {
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    email: '',
    account_type: 'prospect' as AccountType
  });

  const [address, setAddress] = useState<Partial<Address>>({});
  const [addressValid, setAddressValid] = useState(false);

  const handleSubmit = () => {
    onSave({
      ...formData,
      last_contact_date: new Date().toISOString(),
      notes: '',
      street_address: address.street_address || null,
      city: address.city || null,
      state: address.state || null,
      zip_code: address.zip_code || null,
      latitude: address.latitude || null,
      longitude: address.longitude || null,
      last_order_date: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
            Business Name *
          </label>
          <input
            type="text"
            id="business_name"
            required
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
            Contact Name
          </label>
          <input
            type="text"
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <AddressInput
            value={address}
            onChange={setAddress}
            onValidation={setAddressValid}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!addressValid || !formData.business_name}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
        >
          Create Contact
        </button>
      </div>
    </div>
  );
}