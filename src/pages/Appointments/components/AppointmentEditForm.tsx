import { useState } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { Appointment, AppointmentType } from '../../../types/appointment';
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
    if (!user) {
      console.error('User is not authenticated');
      return [];
    }

    const appointmentDate = new Date(`${formData.date}T${formData.time}`);

    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .neq('id', appointment.id)
      .gte('date', new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000).toISOString())
      .lte('date', new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000).toISOString());

    return checkForConflicts(existingAppointments || [], appointmentDate, formData.duration, appointment.id);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, force: boolean = false) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to edit the appointment.');
      return;
    }

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
          {/* Form Fields */}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
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
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <ConflictModal
        open={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        onConfirm={() => handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>, true)}
        conflicts={conflicts}
      />
    </>
  );
}
