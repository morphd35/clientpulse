export type AccountType = 'active' | 'prospect' | 'inactive';

export interface Account {
  id?: number;
  business_name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  last_contact_date: string;
  last_order_date: string | null;
  notes: string | null;
  account_type: AccountType;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}