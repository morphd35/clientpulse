export function formatAddress(address: {
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
}): string {
  const parts = [
    address.street_address,
    address.city,
    address.state,
    address.zip_code
  ].filter(Boolean);
  
  return parts.join(', ');
}

export function parseAddress(fullAddress: string): {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
} {
  // This is a placeholder for future Google Places API integration
  return {
    street_address: fullAddress,
    city: '',
    state: '',
    zip_code: ''
  };
}