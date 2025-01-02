import { Injectable } from '@nativescript/core';
import { LocalNotifications } from '@nativescript/local-notifications';
import { Appointment } from '../../models/appointment.model';

@Injectable()
export class NotificationService {
  async scheduleAppointmentReminder(appointment: Appointment): Promise<void> {
    const notificationTime = new Date(appointment.date);
    notificationTime.setMinutes(notificationTime.getMinutes() - 30);

    await LocalNotifications.schedule([{
      id: appointment.id,
      title: 'Upcoming Appointment',
      body: `Appointment at ${appointment.date.toLocaleTimeString()}`,
      scheduled: true,
      at: notificationTime
    }]);
  }

  async cancelAppointmentReminder(appointmentId: number): Promise<void> {
    await LocalNotifications.cancel(appointmentId);
  }
}