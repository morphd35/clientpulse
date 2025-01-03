import { CalendarIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/20/solid';

interface QuickActionButtonsProps {
  phone?: string; // Explicitly optional string
  email?: string; // Explicitly optional string
  onSchedule?: () => void;
  className?: string;
}

export default function QuickActionButtons({
  phone,
  email,
  onSchedule,
  className = '',
}: QuickActionButtonsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Schedule Appointment Button */}
      {onSchedule && (
        <button
          onClick={onSchedule}
          className="p-2 rounded-full text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Schedule appointment"
          title="Schedule appointment"
        >
          <CalendarIcon className="h-5 w-5" />
        </button>
      )}

      {/* Phone Link */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="p-2 rounded-full text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={`Call ${phone}`}
          title={`Call ${phone}`}
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
      )}

      {/* Email Link */}
      {email && (
        <a
          href={`mailto:${email}`}
          className="p-2 rounded-full text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label={`Email ${email}`}
          title={`Email ${email}`}
        >
          <EnvelopeIcon className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
