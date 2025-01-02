import { useState, useEffect } from 'react';
import { PlacesService } from '../../services/places/places.service';
import { Address } from '../../types/address';
import AddressFields from '../AddressFields';

interface AddressAutocompleteProps {
  value: Partial<Address>;
  onChange: (address: Partial<Address>) => void;
  error?: string;
}

export default function AddressAutocomplete({ value, onChange, error }: AddressAutocompleteProps) {
  const [useManualInput, setUseManualInput] = useState(false);
  const placesService = PlacesService.getInstance();

  useEffect(() => {
    const init = async () => {
      await placesService.initialize();
      setUseManualInput(placesService.isManualInputRequired());
    };

    init();
  }, []);

  // Always render manual input if Places API is not available
  if (useManualInput) {
    return (
      <div>
        <AddressFields
          value={value}
          onChange={onChange}
          error={error}
        />
      </div>
    );
  }

  return (
    <div>
      <AddressFields
        value={value}
        onChange={onChange}
        error={error}
      />
      <p className="mt-2 text-sm text-gray-500">
        Address validation is currently unavailable. Manual input is enabled.
      </p>
    </div>
  );
}