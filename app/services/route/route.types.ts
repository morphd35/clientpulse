import { Appointment } from '../../models/appointment.model';

export interface RouteStop {
  appointment: Appointment;
  location: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
}