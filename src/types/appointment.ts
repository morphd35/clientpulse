export type AppointmentType = 'sales' | 'follow-up' | 'introduction';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: number;
  account_id: number;
  date: string;
  duration: number;
  type: AppointmentType;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}