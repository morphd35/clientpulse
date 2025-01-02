import { Observable } from '@nativescript/core';
import { DatabaseService } from '../../services/database.service';
import { getDaysSinceDate } from '../../utils/date.util';
import { calculatePriority, getPriorityColor } from '../../utils/priority.util';
import { Account } from '../../models/account.model';

export class CallListViewModel extends Observable {
    private _callList: any[] = [];
    private databaseService: DatabaseService;

    constructor() {
        super();
        this.databaseService = new DatabaseService();
        this.loadCallList();
    }

    async loadCallList() {
        await this.databaseService.init();
        const accounts = await this.databaseService.getAccounts();
        
        this._callList = this.processAccounts(accounts);
        this.notifyPropertyChange('callList', this._callList);
    }

    private processAccounts(accounts: Account[]): any[] {
        return accounts
            .map(account => {
                const daysSinceContact = getDaysSinceDate(account.lastContactDate);
                const priority = calculatePriority(daysSinceContact, account.accountType);
                return {
                    ...account,
                    daysSinceContact,
                    priority,
                    priorityColor: getPriorityColor(priority)
                };
            })
            .sort((a, b) => b.priority - a.priority);
    }

    get callList(): any[] {
        return this._callList;
    }

    onCallItemTap(args) {
        const tappedItem = this._callList[args.index];
        // Navigate to account details or initiate call
        console.log('Tapped account:', tappedItem.businessName);
    }
}