import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Account } from '../../models/account.model';
import { SUPABASE_CONFIG } from '../../config/supabase.config';
import { handleDatabaseError } from '../../utils/error.util';

export class SupabaseService {
    private supabase: SupabaseClient;
    private static instance: SupabaseService;

    constructor() {
        if (SupabaseService.instance) {
            return SupabaseService.instance;
        }

        this.supabase = createClient(
            SUPABASE_CONFIG.URL,
            SUPABASE_CONFIG.ANON_KEY,
            {
                auth: {
                    persistSession: false
                }
            }
        );

        SupabaseService.instance = this;
    }

    async getCurrentUser() {
        const { data: { user }, error } = await this.supabase.auth.getUser();
        if (error) throw error;
        return user;
    }

    async testConnection(): Promise<boolean> {
        try {
            const { error } = await this.supabase
                .from('accounts')
                .select('count')
                .limit(1);

            return !error;
        } catch (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
    }

    async getAccounts(): Promise<Account[]> {
        try {
            const { data, error } = await this.supabase
                .from('accounts')
                .select('*')
                .order('last_contact_date', { ascending: false });

            if (error) throw error;
            return this.mapDatabaseAccountsToModels(data);
        } catch (error) {
            return handleDatabaseError(error);
        }
    }

    async addAccount(account: Account): Promise<Account> {
        try {
            const user = await this.getCurrentUser();
            const { data, error } = await this.supabase
                .from('accounts')
                .insert([{ ...this.mapModelToDatabase(account), user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            return this.mapDatabaseAccountsToModels([data])[0];
        } catch (error) {
            return handleDatabaseError(error);
        }
    }

    async updateAccount(account: Account): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('accounts')
                .update(this.mapModelToDatabase(account))
                .eq('id', account.id);

            if (error) throw error;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    private mapDatabaseAccountsToModels(data: any[]): Account[] {
        return data.map(row => ({
            id: row.id,
            businessName: row.business_name,
            contactName: row.contact_name,
            phone: row.phone,
            email: row.email,
            address: row.address,
            latitude: row.latitude,
            longitude: row.longitude,
            lastContactDate: new Date(row.last_contact_date),
            lastOrderDate: row.last_order_date ? new Date(row.last_order_date) : undefined,
            notes: row.notes,
            accountType: row.account_type,
            userId: row.user_id
        }));
    }

    private mapModelToDatabase(account: Account): any {
        return {
            business_name: account.businessName,
            contact_name: account.contactName,
            phone: account.phone,
            email: account.email,
            address: account.address,
            latitude: account.latitude,
            longitude: account.longitude,
            last_contact_date: account.lastContactDate.toISOString(),
            last_order_date: account.lastOrderDate?.toISOString(),
            notes: account.notes,
            account_type: account.accountType
        };
    }
}