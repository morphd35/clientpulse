import { Property, View } from '@nativescript/core';
import { Account } from '../../models/account.model';
import { getAccountTypeColor } from '../../utils/account.utils';
import { formatDate } from '../../../../utils/date.util';

export class AccountCard extends View {
    private _account: Account;

    static accountProperty = new Property<AccountCard, Account>({
        name: 'account',
        defaultValue: undefined,
        valueChanged: (target, oldValue, newValue) => {
            target.updateData(newValue);
        }
    });

    constructor() {
        super();
    }

    get account(): Account {
        return this._account;
    }

    set account(value: Account) {
        this._account = value;
        this.updateData(value);
    }

    private updateData(account: Account) {
        if (!account) return;

        this.set('businessName', account.businessName);
        this.set('contactName', account.contactName);
        this.set('accountType', account.accountType);
        this.set('formattedDate', formatDate(account.lastContactDate));
        this.set('typeColor', getAccountTypeColor(account.accountType));
    }
}

AccountCard.accountProperty.register(AccountCard);