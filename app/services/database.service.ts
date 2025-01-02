import { Injectable } from '@nativescript/core';
import { Sqlite } from '@nativescript/sqlite';
import { Account } from '../models/account.model';
import { Appointment } from '../models/appointment.model';

@Injectable()
export class DatabaseService {
  private database: Sqlite;

  async init() {
    this.database = await new Sqlite('southern_glazer.db');
    await this.createTables();
  }

  private async createTables() {
    await this.database.execSQL(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        businessName TEXT NOT NULL,
        contactName TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        latitude REAL,
        longitude REAL,
        lastContactDate TEXT,
        lastOrderDate TEXT,
        notes TEXT,
        accountType TEXT
      )
    `);

    await this.database.execSQL(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        accountId INTEGER,
        date TEXT NOT NULL,
        duration INTEGER,
        type TEXT,
        notes TEXT,
        status TEXT,
        FOREIGN KEY(accountId) REFERENCES accounts(id)
      )
    `);
  }

  async addAccount(account: Account): Promise<number> {
    const result = await this.database.execSQL(
      `INSERT INTO accounts (businessName, contactName, phone, email, address, 
        latitude, longitude, lastContactDate, lastOrderDate, notes, accountType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [account.businessName, account.contactName, account.phone, account.email,
       account.address, account.latitude, account.longitude,
       account.lastContactDate.toISOString(), 
       account.lastOrderDate?.toISOString(),
       account.notes, account.accountType]
    );
    return result.insertId;
  }

  async getAccounts(): Promise<Account[]> {
    const results = await this.database.all('SELECT * FROM accounts');
    return results.map(row => ({
      ...row,
      lastContactDate: new Date(row.lastContactDate),
      lastOrderDate: row.lastOrderDate ? new Date(row.lastOrderDate) : undefined
    }));
  }

  async addAppointment(appointment: Appointment): Promise<number> {
    const result = await this.database.execSQL(
      `INSERT INTO appointments (accountId, date, duration, type, notes, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [appointment.accountId, appointment.date.toISOString(),
       appointment.duration, appointment.type, appointment.notes,
       appointment.status]
    );
    return result.insertId;
  }

  async getAppointments(): Promise<Appointment[]> {
    const results = await this.database.all('SELECT * FROM appointments');
    return results.map(row => ({
      ...row,
      date: new Date(row.date)
    }));
  }
}