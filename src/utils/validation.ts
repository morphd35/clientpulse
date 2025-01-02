import { Account } from '../types/account';

export function validateAccount(account: Partial<Account>): string[] {
  const errors: string[] = [];

  if (!account.business_name?.trim()) {
    errors.push('Business name is required');
  }

  if (!account.account_type) {
    errors.push('Account type is required');
  }

  if (account.email && !isValidEmail(account.email)) {
    errors.push('Invalid email format');
  }

  if (account.phone && !isValidPhone(account.phone)) {
    errors.push('Invalid phone format');
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
}