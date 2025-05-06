import React from "react";

interface SuccessNotificationProps {
  onViewStatus?: () => void;
  onDismiss?: () => void;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  onViewStatus,
  onDismiss,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Completed</h2>
        <p className="text-gray-600 mb-4">
          Your order has been placed successfully. Thank you for your purchase!
        </p>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
            onClick={onViewStatus}
          >
            View Status
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
