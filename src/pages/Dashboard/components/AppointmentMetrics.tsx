import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface AppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  completionRate: number;
}

export default function AppointmentMetrics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    completed: 0,
    cancelled: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppointmentStats();
    }
  }, [user]);

  async function fetchAppointmentStats() {
    try {
      setLoading(true);
      setError(null);

      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('status')
        .eq('user_id', user?.id)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (fetchError) throw fetchError;

      const total = data?.length || 0;
      const completed = data?.filter(a => a.status === 'completed').length || 0;
      const cancelled = data?.filter(a => a.status === 'cancelled').length || 0;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      setStats({
        total,
        completed,
        cancelled,
        completionRate
      });
    } catch (err) {
      console.error('Error fetching appointment stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointment statistics');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="h-48 bg-white shadow rounded-lg animate-pulse" />;
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-base font-semibold text-gray-900">
          Appointment Metrics - {format(new Date(), 'MMMM yyyy')}
        </h2>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Completion Rate</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stats.completionRate.toFixed(1)}%
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Completed Appointments</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stats.completed}
              <span className="ml-2 text-sm font-medium text-gray-500">
                of {stats.total}
              </span>
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Cancelled Appointments</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stats.cancelled}
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({((stats.cancelled / stats.total) * 100).toFixed(1)}%)
              </span>
            </dd>
          </div>
        </dl>

        {/* Visual representation */}
        <div className="mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Completion Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {stats.completionRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
              <div
                style={{ width: `${stats.completionRate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}