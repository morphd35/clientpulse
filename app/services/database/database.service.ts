import { knownFolders } from '@nativescript/core';
import { Account, AccountFilters } from '../../models/account.model';
import { Appointment, AppointmentFilters } from '../../models/appointment.model';
import { AccountQueries } from './queries/account.queries';
import { AppointmentQueries } from './queries/appointment.queries';
import { Sqlite } from '@nativescript-community/sqlite';

export class DatabaseService {
  private database: Sqlite;
  private accountQueries: AccountQueries;
  private appointmentQueries: AppointmentQueries;
  private readonly dbPath: string;

  constructor() {
    this.accountQueries = new AccountQueries();
    this.appointmentQueries = new AppointmentQueries();
    this.dbPath = knownFolders.documents().path + '/southern_glazer.db';
  }

  async init(): Promise<void> {
    try {
      this.database = new Sqlite(this.dbPath);
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    try {
      await this.database.execSQL(this.accountQueries.createTableQuery);
      await this.database.execSQL(this.appointmentQueries.createTableQuery);
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  async addAccount(account: Account): Promise<number> {
    try {
      const result = await this.database.execSQL(
        this.accountQueries.insertQuery,
        this.accountQueries.getInsertParams(account)
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  }

  async updateAccount(account: Account): Promise<void> {
    try {
      await this.database.execSQL(
        this.accountQueries.updateQuery,
        [
          account.businessName,
          account.contactName,
          account.phone,
          account.email,
          account.address,
          account.latitude,
          account.longitude,
          account.lastContactDate.toISOString(),
          account.lastOrderDate?.toISOString(),
          account.notes,
          account.accountType,
          account.id
        ]
      );
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  async getAccounts(filters?: AccountFilters): Promise<Account[]> {
    try {
      let query = this.accountQueries.selectAllQuery;
      const params: any[] = [];

      if (filters?.accountType) {
        query = this.accountQueries.selectByTypeQuery;
        params.push(filters.accountType);
      }

      const results = await this.database.all(query, params);
      return results.map(this.accountQueries.mapResultToAccount);
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }

  async addAppointment(appointment: Appointment): Promise<number> {
    try {
      const result = await this.database.execSQL(
        this.appointmentQueries.insertQuery,
        this.appointmentQueries.getInsertParams(appointment)
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  }

  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      let query = this.appointmentQueries.selectAllQuery;
      const params: any[] = [];

      if (filters?.startDate && filters?.endDate) {
        query = this.appointmentQueries.selectByDateRangeQuery;
        params.push(filters.startDate.toISOString(), filters.endDate.toISOString());
      }

      const results = await this.database.all(query, params);
      return results.map(this.appointmentQueries.mapResultToAppointment);
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  }
}