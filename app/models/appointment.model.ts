export interface Appointment {
  id?: number;
  accountId: number;
  date: Date;
  duration: number;
  type: AppointmentType;
  notes: string;
  status: AppointmentStatus;
}

export type AppointmentType = 'sales' | 'follow-up' | 'introduction';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface AppointmentFilters {
  startDate?: Date;
  endDate?: Date;
  status?: AppointmentStatus;
  type?: AppointmentType;
}