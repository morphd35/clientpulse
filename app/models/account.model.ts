export type AccountType = 'active' | 'prospect' | 'inactive';

export interface Account {
    id?: number;
    businessName: string;
    contactName: string;
    phone: string;
    email: string;
    address: string;
    latitude?: number;
    longitude?: number;
    lastContactDate: Date;
    lastOrderDate?: Date;
    notes: string;
    accountType: AccountType;
    userId?: string;
}