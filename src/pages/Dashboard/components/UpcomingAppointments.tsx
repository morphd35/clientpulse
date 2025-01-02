import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, isTomorrow, startOfDay, endOfMonth } from 'date-fns';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { Appointment } from '../../../types/appointment';
import AppointmentStatusBadge from '../../Appointments/components/AppointmentStatusBadge';
import { formatAddress } from '../../../utils/address';

export default function UpcomingAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<(Appointment & { account: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError(null);
      
      // Get appointments from start of today until end of month
      const startDate = startOfDay(new Date()).toISOString();
      const endDate = endOfMonth(new Date()).toISOString();
      
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          account:accounts (
            business_name,
            contact_name,
            street_address,
            city,
            state,
            zip_code
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'scheduled')
        .gte('date', startDate)
        .lte('date', endDate)
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

  function getDateLabel(date: string) {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return 'Today';
    if (isTomorrow(appointmentDate)) return 'Tomorrow';
    return format(appointmentDate, 'MMM d, yyyy');
  }

  if (loading) {
    return (
      <div className="bg-white shadow sm:rounded-lg animate-pulse">
        <div className="h-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Schedule
          </h3>
          <Link
            to="/appointments"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all appointments
          </Link>
        </div>
      </div>
      
      {appointments.length === 0 ? (
        <div className="px-4 py-10 sm:px-6">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900">No appointments today</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by scheduling a new appointment
            </p>
            <div className="mt-6">
              <Link
                to="/appointments"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Schedule appointment
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <ul role="list" className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-blue-600">
                      {getDateLabel(appointment.date)}
                    </span>
                    <span className="text-gray-500">·</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(appointment.date), 'h:mm a')}
                    </span>
                    <span className="text-gray-500">·</span>
                    <span className="text-sm text-gray-500">
                      {appointment.duration} min
                    </span>
                  </div>
                  <div className="mt-1">
                    <h4 className="text-base font-medium text-gray-900">
                      {appointment.account.business_name}
                    </h4>
                    {appointment.account.contact_name && (
                      <p className="text-sm text-gray-600">
                        Contact: {appointment.account.contact_name}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {formatAddress(appointment.account)}
                    </p>
                    {appointment.notes && (
                      <p className="mt-1 text-sm text-gray-600">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-6 flex flex-shrink-0 items-center gap-4">
                  <AppointmentStatusBadge status={appointment.status} />
                  <Link
                    to={`/appointments`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Edit appointment</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}