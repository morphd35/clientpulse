import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase';

export default function TodaysSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    todayAppointments: 0,
    pendingCalls: 0,
    activeAccounts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  async function fetchSummary() {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get today's appointments
      const { count: appointmentCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'scheduled')
        .gte('date', today.toISOString())
        .lt('date', tomorrow.toISOString());

      // Get pending calls (accounts not contacted in last 10 days)
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const { count: callCount } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .lt('last_contact_date', tenDaysAgo.toISOString());

      // Get active accounts count
      const { count: activeCount } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('account_type', 'active');

      setSummary({
        todayAppointments: appointmentCount || 0,
        pendingCalls: callCount || 0,
        activeAccounts: activeCount || 0
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="h-24 bg-white shadow rounded-lg animate-pulse" />;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900">
          Today's Overview - {format(new Date(), 'EEEE, MMMM d')}
        </h2>
        
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-blue-50 px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-blue-800">Today's Appointments</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-blue-600">
                {summary.todayAppointments}
              </div>
              <Link
                to="/appointments"
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 hover:bg-blue-200"
              >
                View All
              </Link>
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-yellow-50 px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-yellow-800">Pending Calls</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-yellow-600">
                {summary.pendingCalls}
              </div>
              <Link
                to="/call-list"
                className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 hover:bg-yellow-200"
              >
                View List
              </Link>
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-green-50 px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-green-800">Active Accounts</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-green-600">
                {summary.activeAccounts}
              </div>
              <Link
                to="/accounts"
                className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 hover:bg-green-200"
              >
                View All
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}