// import React from 'react';
import UpcomingAppointments from './components/UpcomingAppointments';
import TodaysSummary from './components/TodaysSummary';
import QuickActions from './components/QuickActions';
import AppointmentMetrics from './components/AppointmentMetrics';
import { PencilIcon, TrashIcon, CalendarIcon, PhoneIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Today's Summary */}
      <TodaysSummary />

      {/* Appointment Metrics */}
      <AppointmentMetrics />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Appointments (Larger Column) */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <UpcomingAppointments />
        </div>

        {/* Quick Actions (Side Column) */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <QuickActions
            icons={{
              edit: PencilIcon,
              delete: TrashIcon,
              calendar: CalendarIcon,
              phone: PhoneIcon,
              email: EnvelopeIcon,
              cancel: XMarkIcon,
            }}
          />
        </div>
      </div>
    </div>
  );
}
