import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';
import { Appointment } from '../../../types/appointment';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import AppointmentActions from './AppointmentActions';
import QuickActionButtons from '../../../components/QuickActionButtons';
import { formatAddress } from '../../../utils/address';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import StatusChangeModal from './StatusChangeModal';

export default function AppointmentList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<(Appointment & { account: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusToChange, setStatusToChange] = useState<'completed' | 'cancelled'>('completed');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          account:accounts (
            id,
            business_name,
            contact_name,
            phone,
            email,
            street_address,
            city,
            state,
            zip_code
          )
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!selectedAppointment || !user) return;

    try {
      setIsUpdating(true);
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', selectedAppointment.id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    } finally {
      setIsUpdating(false);
      setSelectedAppointment(null);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedAppointment || !user) return;

    try {
      setIsUpdating(true);
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: statusToChange })
        .eq('id', selectedAppointment.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAppointments(appointments.map(a => 
        a.id === selectedAppointment.id 
          ? { ...a, status: statusToChange }
          : a
      ));
      setShowStatusModal(false);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update appointment status');
    } finally {
      setIsUpdating(false);
      setSelectedAppointment(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading appointments...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No appointments found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900">
                  {format(new Date(appointment.date), 'MMM d, yyyy h:mm a')}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {appointment.account.business_name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatAddress(appointment.account)}
                </div>
              </div>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <QuickActionButtons
                phone={appointment.account.phone}
                email={appointment.account.email}
              />
              <AppointmentActions
                onEdit={() => {}}
                onDelete={() => {
                  setSelectedAppointment(appointment);
                  setShowDeleteModal(true);
                }}
                onComplete={() => {
                  setSelectedAppointment(appointment);
                  setStatusToChange('completed');
                  setShowStatusModal(true);
                }}
                onCancel={() => {
                  setSelectedAppointment(appointment);
                  setStatusToChange('cancelled');
                  setShowStatusModal(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Date & Time
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Account
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Contact
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                  <div className="font-medium text-gray-900">
                    {format(new Date(appointment.date), 'MMM d, yyyy')}
                  </div>
                  <div className="text-gray-500">
                    {format(new Date(appointment.date), 'h:mm a')}
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div className="font-medium text-gray-900">
                    {appointment.account.business_name}
                  </div>
                  <div className="text-gray-500">
                    {formatAddress(appointment.account)}
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div className="font-medium text-gray-900">
                    {appointment.account.contact_name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <QuickActionButtons
                      phone={appointment.account.phone}
                      email={appointment.account.email}
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <AppointmentStatusBadge status={appointment.status} />
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                  <AppointmentActions
                    onEdit={() => {}}
                    onDelete={() => {
                      setSelectedAppointment(appointment);
                      setShowDeleteModal(true);
                    }}
                    onComplete={() => {
                      setSelectedAppointment(appointment);
                      setStatusToChange('completed');
                      setShowStatusModal(true);
                    }}
                    onCancel={() => {
                      setSelectedAppointment(appointment);
                      setStatusToChange('cancelled');
                      setShowStatusModal(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteAppointmentModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isUpdating}
      />

      <StatusChangeModal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusChange}
        status={statusToChange}
        isUpdating={isUpdating}
      />
    </>
  );
}