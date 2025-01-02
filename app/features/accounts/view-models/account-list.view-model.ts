import { Observable } from '@nativescript/core';
import { Account } from '../../../models/account.model';
import { AccountService } from '../services/account.service';
import { formatDate } from '../../../utils/date.util';

export class AccountListViewModel extends Observable {
    private _accounts: Account[] = [];
    private _searchQuery: string = '';
    private accountService: AccountService;

    constructor() {
        super();
        this.accountService = new AccountService();
        this.loadAccounts();
    }

    async loadAccounts(): Promise<void> {
        try {
            await this.accountService.initialize();
            this._accounts = await this.accountService.getAccounts();
            this._accounts = this._accounts.map(account => ({
                ...account,
                formattedDate: formatDate(account.lastContactDate)
            }));
            this.notifyPropertyChange('accounts', this.accounts);
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    }

    get accounts(): Account[] {
        return this.filterAccounts(this._accounts, this._searchQuery);
    }

    set searchQuery(value: string) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this.notifyPropertyChange('accounts', this.accounts);
        }
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    private filterAccounts(accounts: Account[], query: string): Account[] {
        if (!query) return accounts;
        
        const searchTerm = query.toLowerCase();
        return accounts.filter(account => 
            account.businessName.toLowerCase().includes(searchTerm) ||
            account.contactName.toLowerCase().includes(searchTerm)
        );
    }
}