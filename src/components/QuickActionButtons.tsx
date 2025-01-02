import { CalendarIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/20/solid';

interface QuickActionButtonsProps {
  phone?: string | null;
  email?: string | null;
  onSchedule?: () => void;
  className?: string;
}

export default function QuickActionButtons({ phone, email, onSchedule, className = '' }: QuickActionButtonsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onSchedule && (
        <button
          onClick={onSchedule}
          className="text-blue-600 hover:text-blue-800"
          title="Schedule appointment"
        >
          <CalendarIcon className="h-5 w-5" />
        </button>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="text-green-600 hover:text-green-800"
          title={`Call ${phone}`}
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="text-yellow-600 hover:text-yellow-800"
          title={`Email ${email}`}
        >
          <EnvelopeIcon className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}