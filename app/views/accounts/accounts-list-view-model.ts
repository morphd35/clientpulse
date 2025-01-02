import { BaseViewModel } from '../../core/base/base-view-model';
import { Account } from '../../models/account.model';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { NavigationService } from '../../core/navigation/navigation.service';

export class AccountsListViewModel extends BaseViewModel {
    private _accounts: Account[] = [];
    private _searchQuery: string = '';
    private supabaseService: SupabaseService;

    constructor() {
        super();
        this.supabaseService = new SupabaseService();
        this.loadAccounts();
    }

    async loadAccounts() {
        try {
            this.isLoading = true;
            this._accounts = await this.supabaseService.getAccounts();
            this.notifyPropertyChange('accounts', this.accounts);
        } catch (error) {
            this.showError(error);
        } finally {
            this.isLoading = false;
        }
    }

    get accounts(): Account[] {
        if (!this._searchQuery) {
            return this._accounts;
        }
        
        const query = this._searchQuery.toLowerCase();
        return this._accounts.filter(account => 
            account.businessName.toLowerCase().includes(query) ||
            account.contactName?.toLowerCase().includes(query)
        );
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

    navigateToAccountForm(account?: Account) {
        NavigationService.navigate('views/accounts/account-form', { account });
    }
}