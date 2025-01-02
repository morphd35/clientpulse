import { Observable } from '@nativescript/core';
import { Account, AccountType } from '../../models/account.model';
import { SupabaseService } from '../../services/supabase/supabase.service';

export class AccountFormViewModel extends Observable {
    private supabaseService: SupabaseService;
    private _isEditing: boolean = false;
    private _accountId?: number;
    private _error: string = '';

    businessName: string = '';
    contactName: string = '';
    phone: string = '';
    email: string = '';
    address: string = '';
    notes: string = '';
    accountTypes: AccountType[] = ['active', 'prospect', 'inactive'];
    selectedAccountTypeIndex: number = 0;

    constructor(account?: Account) {
        super();
        this.supabaseService = new SupabaseService();
        this.initializeForm(account);
    }

    private initializeForm(account?: Account): void {
        if (account) {
            this._isEditing = true;
            this._accountId = account.id;
            this.businessName = account.businessName;
            this.contactName = account.contactName;
            this.phone = account.phone;
            this.email = account.email;
            this.address = account.address;
            this.notes = account.notes;
            this.selectedAccountTypeIndex = this.accountTypes.indexOf(account.accountType);
        }
    }

    get isEditing(): boolean {
        return this._isEditing;
    }

    get error(): string {
        return this._error;
    }

    set error(value: string) {
        if (this._error !== value) {
            this._error = value;
            this.notifyPropertyChange('error', value);
        }
    }

    async saveAccount(): Promise<void> {
        try {
            const isConnected = await this.supabaseService.testConnection();
            if (!isConnected) {
                throw new Error('Unable to connect to database');
            }

            const account: Account = {
                id: this._accountId,
                businessName: this.businessName,
                contactName: this.contactName,
                phone: this.phone,
                email: this.email,
                address: this.address,
                notes: this.notes,
                accountType: this.accountTypes[this.selectedAccountTypeIndex],
                lastContactDate: new Date()
            };

            if (this._isEditing) {
                await this.supabaseService.updateAccount(account);
            } else {
                await this.supabaseService.addAccount(account);
            }
        } catch (error) {
            console.error('Error saving account:', error);
            this.error = error instanceof Error ? error.message : 'Error saving account';
            throw error;
        }
    }
}