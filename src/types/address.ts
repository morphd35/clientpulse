export interface Address {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface AddressValidationResult {
  isValid: boolean;
  errors: string[];
}