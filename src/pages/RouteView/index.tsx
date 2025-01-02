import { useState } from 'react';

export default function RouteView() {
  const [isLoading] = useState(false);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Route Planning</h1>
          <p className="mt-2 text-sm text-gray-700">
            Optimize your daily route based on appointments and locations
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
          >
            Optimize Route
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading route...</div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
          Route planning feature coming soon...
        </div>
      )}
    </div>
  );
}