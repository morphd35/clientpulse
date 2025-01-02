export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface AddressFieldsProps {
  address: Partial<Address>;
  onChange: (address: Partial<Address>) => void;
  error?: string;
}