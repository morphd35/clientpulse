import { Appointment, AppointmentStatus, AppointmentType } from '../../../models/appointment.model';

export class AppointmentQueries {
  readonly createTableQuery = `
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      accountId INTEGER,
      date TEXT NOT NULL,
      duration INTEGER,
      type TEXT CHECK(type IN ('sales', 'follow-up', 'introduction')),
      notes TEXT,
      status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')),
      FOREIGN KEY(accountId) REFERENCES accounts(id)
    )
  `;

  readonly insertQuery = `
    INSERT INTO appointments (
      accountId, date, duration, type, notes, status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  readonly selectAllQuery = 'SELECT * FROM appointments ORDER BY date ASC';

  readonly selectUpcomingQuery = `
    SELECT * FROM appointments 
    WHERE date >= datetime('now') 
    AND status = 'scheduled'
    ORDER BY date ASC
  `;

  readonly selectByDateRangeQuery = `
    SELECT * FROM appointments 
    WHERE date BETWEEN ? AND ?
    ORDER BY date ASC
  `;

  getInsertParams(appointment: Appointment): any[] {
    return [
      appointment.accountId,
      appointment.date.toISOString(),
      appointment.duration,
      appointment.type,
      appointment.notes,
      appointment.status
    ];
  }

  mapResultToAppointment(row: any): Appointment {
    return {
      ...row,
      date: new Date(row.date),
      type: row.type as AppointmentType,
      status: row.status as AppointmentStatus
    };
  }
}