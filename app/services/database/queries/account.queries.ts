import { Account, AccountType } from '../../../models/account.model';

export class AccountQueries {
  readonly createTableQuery = `
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
      accountType TEXT CHECK(accountType IN ('active', 'prospect', 'inactive'))
    )
  `;

  readonly insertQuery = `
    INSERT INTO accounts (
      businessName, contactName, phone, email, address,
      latitude, longitude, lastContactDate, lastOrderDate,
      notes, accountType
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  readonly updateQuery = `
    UPDATE accounts SET
      businessName = ?,
      contactName = ?,
      phone = ?,
      email = ?,
      address = ?,
      latitude = ?,
      longitude = ?,
      lastContactDate = ?,
      lastOrderDate = ?,
      notes = ?,
      accountType = ?
    WHERE id = ?
  `;

  readonly selectAllQuery = 'SELECT * FROM accounts ORDER BY lastContactDate DESC';

  readonly selectByTypeQuery = 'SELECT * FROM accounts WHERE accountType = ? ORDER BY lastContactDate DESC';

  getInsertParams(account: Account): any[] {
    return [
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
      account.accountType
    ];
  }

  mapResultToAccount(row: any): Account {
    return {
      id: row.id,
      businessName: row.businessName,
      contactName: row.contactName,
      phone: row.phone,
      email: row.email,
      address: row.address,
      latitude: row.latitude,
      longitude: row.longitude,
      lastContactDate: new Date(row.lastContactDate),
      lastOrderDate: row.lastOrderDate ? new Date(row.lastOrderDate) : undefined,
      notes: row.notes,
      accountType: row.accountType as AccountType
    };
  }
}