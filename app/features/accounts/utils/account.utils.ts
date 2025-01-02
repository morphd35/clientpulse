import { Account, AccountType } from '../../../models/account.model';

export function getAccountTypeColor(type: AccountType): { background: string; text: string } {
    switch (type) {
        case 'active':
            return { background: '#dcfce7', text: '#166534' };
        case 'prospect':
            return { background: '#fef9c3', text: '#854d0e' };
        default:
            return { background: '#f3f4f6', text: '#4b5563' };
    }
}

export function validateAccount(account: Partial<Account>): string[] {
    const errors: string[] = [];
    
    if (!account.businessName?.trim()) {
        errors.push('Business name is required');
    }
    
    if (!account.accountType) {
        errors.push('Account type is required');
    }
    
    if (account.email && !isValidEmail(account.email)) {
        errors.push('Invalid email format');
    }
    
    return errors;
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}