import { supabase } from '../../lib/supabase';
import { Account } from '../../types/account';

export class AccountService {
  static async getAllAccounts(): Promise<Account[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('business_name');

    if (error) throw error;
    return data || [];
  }
}