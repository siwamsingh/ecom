// components/order/ErrorState.tsx
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onReturnToProducts: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onReturnToProducts }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Unable to Process Order</h2>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={onReturnToProducts}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return to Products
        </button>
      </div>
    </div>
  );
};

export default ErrorState;