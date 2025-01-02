import { Account } from '../types/account';
import { formatAddress } from './address';

export function exportAccountsToCSV(accounts: Account[]): void {
  // Define CSV headers
  const headers = [
    'Business Name',
    'Contact Name',
    'Phone',
    'Email',
    'Address',
    'Account Type',
    'Last Contact Date'
  ];

  // Transform accounts data into CSV rows
  const rows = accounts.map(account => [
    account.business_name,
    account.contact_name || '',
    account.phone || '',
    account.email || '',
    formatAddress(account),
    account.account_type,
    new Date(account.last_contact_date).toLocaleDateString()
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `accounts_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}