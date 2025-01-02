import { useState, useEffect } from 'react';
import { Address } from '../../types/address';
import { validateAddress } from '../../utils/address-validation';

interface AddressInputProps {
  value: Partial<Address>;
  onChange: (address: Partial<Address>) => void;
  onValidation?: (isValid: boolean) => void;
}

export default function AddressInput({ value, onChange, onValidation }: AddressInputProps) {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const validationErrors = validateAddress(value);
    setErrors(validationErrors);
    onValidation?.(validationErrors.length === 0);
  }, [value, onValidation]);

  const handleChange = (field: keyof Address, fieldValue: string) => {
    onChange({
      ...value,
      [field]: field === 'state' ? fieldValue.toUpperCase() : fieldValue
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <input
          type="text"
          id="street_address"
          value={value.street_address || ''}
          onChange={(e) => handleChange('street_address', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            id="city"
            value={value.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State *
          </label>
          <input
            type="text"
            id="state"
            value={value.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            maxLength={2}
            placeholder="CA"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zip_code"
            value={value.zip_code || ''}
            onChange={(e) => handleChange('zip_code', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            maxLength={10}
            placeholder="12345"
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}