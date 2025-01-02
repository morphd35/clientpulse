import { AppointmentStatus } from '../../../types/appointment';

const statusStyles = {
  scheduled: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  completed: 'bg-green-50 text-green-700 ring-green-600/20',
  cancelled: 'bg-gray-50 text-gray-600 ring-gray-500/10'
};

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export default function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}