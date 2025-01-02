import { Observable } from '@nativescript/core';
import { Account, AccountType } from '../../../models/account.model';
import { AccountService } from '../services/account.service';

export class AccountFormViewModel extends Observable {
    private accountService: AccountService;
    private _isEditing: boolean = false;
    private _accountId?: number;

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
        this.accountService = new AccountService();
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

    async saveAccount(): Promise<void> {
        try {
            await this.accountService.initialize();
            
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
                await this.accountService.updateAccount(account);
            } else {
                await this.accountService.addAccount(account);
            }
        } catch (error) {
            console.error('Error saving account:', error);
            throw error;
        }
    }
}