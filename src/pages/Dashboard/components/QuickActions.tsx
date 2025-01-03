import React from 'react';
// import { PencilIcon, TrashIcon, CalendarIcon, PhoneIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface QuickActionsProps {
  icons: {
    edit: React.FC<React.SVGProps<SVGSVGElement>>;
    delete: React.FC<React.SVGProps<SVGSVGElement>>;
    calendar: React.FC<React.SVGProps<SVGSVGElement>>;
    phone: React.FC<React.SVGProps<SVGSVGElement>>;
    email: React.FC<React.SVGProps<SVGSVGElement>>;
    cancel: React.FC<React.SVGProps<SVGSVGElement>>;
  };
}

export default function QuickActions({ icons }: QuickActionsProps) {
  return (
    <div className="flex flex-col space-y-4">
      <button className="flex items-center space-x-2">
        <icons.edit className="h-5 w-5" />
        <span>Edit</span>
      </button>
      <button className="flex items-center space-x-2">
        <icons.delete className="h-5 w-5" />
        <span>Delete</span>
      </button>
      <button className="flex items-center space-x-2">
        <icons.calendar className="h-5 w-5" />
        <span>Schedule</span>
      </button>
      <button className="flex items-center space-x-2">
        <icons.phone className="h-5 w-5" />
        <span>Call</span>
      </button>
      <button className="flex items-center space-x-2">
        <icons.email className="h-5 w-5" />
        <span>Email</span>
      </button>
      <button className="flex items-center space-x-2">
        <icons.cancel className="h-5 w-5" />
        <span>Cancel</span>
      </button>
    </div>
  );
}
