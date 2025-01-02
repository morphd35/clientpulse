import { useState } from 'react';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';

export default function Appointments() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Schedule and manage your customer appointments
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
          >
            Add Appointment
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="mt-8">
          <AppointmentForm onComplete={() => setShowForm(false)} />
        </div>
      ) : (
        <div className="mt-8">
          <AppointmentList />
        </div>
      )}
    </div>
  );
}