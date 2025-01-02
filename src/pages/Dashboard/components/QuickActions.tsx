import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  MapIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';

const actions = [
  {
    name: 'Add Account',
    description: 'Create a new business contact',
    href: '/accounts/new',
    icon: UserGroupIcon,
    iconBackground: 'bg-blue-500',
    iconForeground: 'text-blue-50'
  },
  {
    name: 'Schedule Meeting',
    description: 'Add a new appointment',
    href: '/appointments',
    icon: CalendarIcon,
    iconBackground: 'bg-green-500',
    iconForeground: 'text-green-50'
  },
  {
    name: 'Plan Route',
    description: 'Optimize your daily visits',
    href: '/route',
    icon: MapIcon,
    iconBackground: 'bg-purple-500',
    iconForeground: 'text-purple-50'
  },
  {
    name: 'View Call List',
    description: 'See pending follow-ups',
    href: '/call-list',
    icon: PhoneIcon,
    iconBackground: 'bg-amber-500',
    iconForeground: 'text-amber-50'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-6 flow-root">
          <div className="-mt-6">
            {actions.map((action) => (
              <div key={action.name} className="relative mt-6">
                <Link
                  to={action.href}
                  className="relative flex items-center space-x-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${action.iconBackground}`}>
                    <action.icon className={`h-6 w-6 ${action.iconForeground}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}