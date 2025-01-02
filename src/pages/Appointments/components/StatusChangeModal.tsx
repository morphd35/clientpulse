import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { AppointmentStatus } from '../../../types/appointment';

interface StatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: Extract<AppointmentStatus, 'completed' | 'cancelled'>;
  isUpdating: boolean;
}

export default function StatusChangeModal({
  open,
  onClose,
  onConfirm,
  status,
  isUpdating
}: StatusChangeModalProps) {
  const Icon = status === 'completed' ? CheckCircleIcon : XCircleIcon;
  const iconClasses = status === 'completed' 
    ? 'bg-green-100 text-green-600'
    : 'bg-yellow-100 text-yellow-600';
  const buttonClasses = status === 'completed'
    ? 'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600'
    : 'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600';

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconClasses}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {status === 'completed' ? 'Complete Appointment' : 'Cancel Appointment'}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to mark this appointment as {status}?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2 ${buttonClasses}`}
                    onClick={onConfirm}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : `Mark as ${status}`}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={onClose}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}