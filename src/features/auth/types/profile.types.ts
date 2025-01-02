export interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileFormData {
  full_name: string;
  email: string;
}