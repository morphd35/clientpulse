import { useAuth } from '../features/auth/hooks/useAuth';
import { useProfile } from '../features/auth/hooks/useProfile';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <span className="text-sm text-gray-700">
            {profile?.full_name}
          </span>
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}