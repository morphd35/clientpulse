import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  MapIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Accounts',
    description: 'Manage your business contacts',
    href: '/accounts',
    icon: UserGroupIcon,
    iconBackground: 'bg-blue-500',
    iconForeground: 'text-blue-50',
    hoverBackground: 'hover:bg-blue-50'
  },
  {
    name: 'Appointments',
    description: 'Schedule and track meetings',
    href: '/appointments',
    icon: CalendarIcon,
    iconBackground: 'bg-green-500',
    iconForeground: 'text-green-50',
    hoverBackground: 'hover:bg-green-50'
  },
  {
    name: 'Route',
    description: 'Plan your daily route',
    href: '/route',
    icon: MapIcon,
    iconBackground: 'bg-purple-500',
    iconForeground: 'text-purple-50',
    hoverBackground: 'hover:bg-purple-50'
  },
  {
    name: 'Call List',
    description: 'View contacts to follow up',
    href: '/call-list',
    icon: PhoneIcon,
    iconBackground: 'bg-amber-500',
    iconForeground: 'text-amber-50',
    hoverBackground: 'hover:bg-amber-50'
  }
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome</h1>
            <p className="mt-2 text-sm text-gray-700">
              Select a section below to get started
            </p>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative flex items-center gap-x-6 rounded-lg p-4 border border-gray-200 bg-white shadow-sm transition-all duration-200 ${item.hoverBackground} hover:shadow-md`}
            >
              <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg ${item.iconBackground}`}>
                <item.icon className={`h-6 w-6 ${item.iconForeground}`} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}