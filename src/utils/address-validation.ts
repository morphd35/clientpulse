import { Address } from '../types/address';

export function validateAddress(address: Partial<Address>): string[] {
  const errors: string[] = [];

  if (!address.street_address?.trim()) {
    errors.push('Street address is required');
  }

  if (!address.city?.trim()) {
    errors.push('City is required');
  }

  if (!address.state?.trim()) {
    errors.push('State is required');
  } else if (!/^[A-Z]{2}$/.test(address.state.toUpperCase())) {
    errors.push('State must be a 2-letter code (e.g., CA)');
  }

  if (!address.zip_code?.trim()) {
    errors.push('ZIP code is required');
  } else if (!/^\d{5}(-\d{4})?$/.test(address.zip_code)) {
    errors.push('Invalid ZIP code format (e.g., 12345 or 12345-6789)');
  }

  return errors;
}

export function formatAddress(address: Partial<Address>): string {
  const parts = [
    address.street_address,
    address.city,
    address.state,
    address.zip_code
  ].filter(Boolean);
  
  return parts.join(', ');
}