import { useState } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { Account } from '../../../types/account';
import { AppointmentType, AppointmentStatus } from '../../../types/appointment';
import ContactSelector from './ContactSelector';

interface AppointmentFormProps {
  onComplete: () => void;
}

export default function AppointmentForm({ onComplete }: AppointmentFormProps) {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    type: 'sales' as AppointmentType,
    notes: '',
    status: 'scheduled' as AppointmentStatus,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('User is not authenticated. Please log in.');
      return;
    }

    if (!selectedContact) {
      setError('No contact selected. Please select a contact.');
      return;
    }

    if (!formData.date || !formData.time) {
      setError('Date and time are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const appointmentDate = new Date(`${formData.date}T${formData.time}`);

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          account_id: selectedContact.id,
          date: appointmentDate.toISOString(),
          duration: formData.duration,
          type: formData.type,
          notes: formData.notes,
          status: formData.status,
          user_id: user.id,
        }]);

      if (appointmentError) throw appointmentError;

      onComplete();
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create the appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Selector */}
      <ContactSelector
        onSelect={setSelectedContact}
        selectedContact={selectedContact}
      />

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time *
          </label>
          <input
            type="time"
            id="time"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes) *
          </label>
          <select
            id="duration"
            required
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type *
          </label>
          <select
            id="type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as AppointmentType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="sales">Sales</option>
            <option value="follow-up">Follow-up</option>
            <option value="introduction">Introduction</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-x-3">
        <button
          type="button"
          onClick={onComplete}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          {loading ? 'Saving...' : 'Create Appointment'}
        </button>
      </div>
    </form>
  );
}
