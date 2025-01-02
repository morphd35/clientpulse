import { PencilIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from '@heroicons/react/20/solid';

interface AppointmentActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export default function AppointmentActions({ onEdit, onDelete, onComplete, onCancel }: AppointmentActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-800"
        title="Edit appointment"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button
        onClick={onComplete}
        className="text-green-600 hover:text-green-800"
        title="Mark as completed"
      >
        <CheckCircleIcon className="h-5 w-5" />
      </button>
      <button
        onClick={onCancel}
        className="text-yellow-600 hover:text-yellow-800"
        title="Cancel appointment"
      >
        <XCircleIcon className="h-5 w-5" />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800"
        title="Delete appointment"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}