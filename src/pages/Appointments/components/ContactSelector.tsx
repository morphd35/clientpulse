import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { Account } from '../../../types/account';
import { supabase } from '../../../lib/supabase';
import NewContactForm from './NewContactForm';
import { formatAddress } from '../../../utils/address';

interface ContactSelectorProps {
  onSelect: (contact: Account | null) => void;
  //onShowNewContact: () => void;
  selectedContact?: Account | null;
}

//export default function ContactSelector({ onSelect, onShowNewContact, selectedContact }: 
export default function ContactSelector({ onSelect, selectedContact }:
  ContactSelectorProps) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Account[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  async function fetchContacts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user?.id)
        .order('business_name', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const search = searchQuery.toLowerCase();
    return (
      contact.business_name.toLowerCase().includes(search) ||
      contact.contact_name?.toLowerCase().includes(search)
    );
  });

  const handleNewContactSave = async (contact: Account) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([{ ...contact, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setContacts([...contacts, data]);
        onSelect(data);
        setShowNewForm(false);
      }
    } catch (err) {
      console.error('Error creating contact:', err);
      setError(err instanceof Error ? err.message : 'Failed to create contact');
    }
  };

  if (showNewForm) {
    return <NewContactForm onSave={handleNewContactSave} onCancel={() => setShowNewForm(false)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
          Select Contact *
        </label>
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="text-sm font-semibold text-blue-600 hover:text-blue-500"
        >
          Add New Contact
        </button>
      </div>

      {selectedContact ? (
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <div className="font-medium text-gray-900">{selectedContact.business_name}</div>
          {selectedContact.contact_name && (
            <div className="text-sm text-gray-600">{selectedContact.contact_name}</div>
          )}
          <div className="text-sm text-gray-600 mt-1">
            {formatAddress(selectedContact)}
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-500"
          >
            Change Contact
          </button>
        </div>
      ) : (
        <>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>

          {loading ? (
            <div className="mt-2 text-sm text-gray-500">Loading contacts...</div>
          ) : error ? (
            <div className="mt-2 text-sm text-red-600">{error}</div>
          ) : filteredContacts.length === 0 ? (
            <div className="mt-2 text-sm text-gray-500">
              No contacts found. Would you like to{' '}
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="text-blue-600 hover:text-blue-500"
              >
                create a new contact
              </button>
              ?
            </div>
          ) : (
            <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white">
              {filteredContacts.map((contact) => (
                <li
                  key={contact.id}
                  className="relative cursor-pointer select-none p-3 hover:bg-gray-50"
                  onClick={() => onSelect(contact)}
                >
                  <div className="font-medium text-gray-900">{contact.business_name}</div>
                  {contact.contact_name && (
                    <div className="text-sm text-gray-600">{contact.contact_name}</div>
                  )}
                  <div className="text-sm text-gray-600 mt-1">
                    {formatAddress(contact)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}