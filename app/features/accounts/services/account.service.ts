import { SupabaseService } from '../../../services/supabase/supabase.service';
import { Account, AccountFilters } from '../../../models/account.model';

export class AccountService {
    private supabaseService: SupabaseService;
    private initialized: boolean = false;

    constructor() {
        this.supabaseService = new SupabaseService();
    }

    async initialize(): Promise<void> {
        if (!this.initialized) {
            try {
                // Any initialization logic if needed
                this.initialized = true;
            } catch (error) {
                console.error('Error initializing AccountService:', error);
                throw error;
            }
        }
    }

    async getAccounts(filters?: AccountFilters): Promise<Account[]> {
        try {
            return await this.supabaseService.getAccounts();
        } catch (error) {
            console.error('Error getting accounts:', error);
            throw error;
        }
    }

    async addAccount(account: Account): Promise<Account> {
        try {
            return await this.supabaseService.addAccount(account);
        } catch (error) {
            console.error('Error adding account:', error);
            throw error;
        }
    }

    async updateAccount(account: Account): Promise<void> {
        try {
            await this.supabaseService.updateAccount(account);
        } catch (error) {
            console.error('Error updating account:', error);
            throw error;
        }
    }
}