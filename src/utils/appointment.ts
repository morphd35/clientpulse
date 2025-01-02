import { Appointment } from '../types/appointment';

export function checkForConflicts(
  appointments: Appointment[],
  newStart: Date,
  duration: number,
  excludeId?: number
): Appointment[] {
  const newEnd = new Date(newStart.getTime() + duration * 60000);
  
  return appointments.filter(appointment => {
    if (appointment.id === excludeId) return false;
    
    const existingStart = new Date(appointment.date);
    const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60000);
    
    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}