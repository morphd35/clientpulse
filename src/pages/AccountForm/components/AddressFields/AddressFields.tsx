import { Address, AddressFieldsProps } from './types';

export default function AddressFields({ address, onChange, error }: AddressFieldsProps) {
  const handleChange = (field: keyof Address, value: string) => {
    onChange({
      ...address,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          id="street"
          value={address.street || ''}
          onChange={(e) => handleChange('street', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            value={address.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            value={address.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            maxLength={2}
            placeholder="CA"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            type="text"
            id="zipCode"
            value={address.zipCode || ''}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            maxLength={10}
            placeholder="12345"
          />
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}