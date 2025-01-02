import { Property, View } from '@nativescript/core';
import { Account } from '../../models/account.model';

export class AccountList extends View {
    private _accounts: Account[] = [];
    private _searchQuery: string = '';

    static accountsProperty = new Property<AccountList, Account[]>({
        name: 'accounts',
        defaultValue: []
    });

    static searchQueryProperty = new Property<AccountList, string>({
        name: 'searchQuery',
        defaultValue: ''
    });

    get filteredAccounts(): Account[] {
        if (!this._searchQuery) return this._accounts;
        
        const query = this._searchQuery.toLowerCase();
        return this._accounts.filter(account => 
            account.businessName.toLowerCase().includes(query) ||
            account.contactName?.toLowerCase().includes(query)
        );
    }
}

AccountList.accountsProperty.register(AccountList);
AccountList.searchQueryProperty.register(AccountList);