import { useState } from 'react';
//import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { Appointment, AppointmentType } from '../../../types/appointment';
//import { Appointment, AppointmentType, AppointmentStatus } from '../../../types/appointment';
import { checkForConflicts } from '../../../utils/appointment';
import ConflictModal from './ConflictModal';

interface AppointmentEditFormProps {
  appointment: Appointment & { account: any };
  onComplete: () => void;
  onCancel: () => void;
}

export default function AppointmentEditForm({ appointment, onComplete, onCancel }: AppointmentEditFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: new Date(appointment.date).toISOString().split('T')[0],
    time: new Date(appointment.date).toTimeString().slice(0, 5),
    duration: appointment.duration,
    type: appointment.type as AppointmentType,
    notes: appointment.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflicts, setConflicts] = useState<Appointment[]>([]);

  async function checkAppointmentConflicts() {
    const appointmentDate = new Date(`${formData.date}T${formData.time}`);

    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user?.id)
      .neq('id', appointment.id)
      .gte('date', new Date(appointmentDate.getTime() - (24 * 60 * 60 * 1000)).toISOString())
      .lte('date', new Date(appointmentDate.getTime() + (24 * 60 * 60 * 1000)).toISOString());

    const conflictingAppointments = checkForConflicts(
      existingAppointments || [],
      appointmentDate,
      formData.duration,
      appointment.id
    );

    return conflictingAppointments;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, force: boolean = false) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      if (!force) {
        const conflictingAppointments = await checkAppointmentConflicts();
        if (conflictingAppointments.length > 0) {
          setConflicts(conflictingAppointments);
          setShowConflictModal(true);
          return;
        }
      }


      const appointmentDate = new Date(`${formData.date}T${formData.time}`);
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          date: appointmentDate.toISOString(),
          duration: formData.duration,
          type: formData.type,
          notes: formData.notes,
        })
        .eq('id', appointment.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      onComplete();
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
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
              <option value={45}>45 minutes</option>
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

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <ConflictModal
        open={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        onConfirm={(e) => handleSubmit(e, true)}
        conflicts={conflicts}
      />
    </>
  );
}