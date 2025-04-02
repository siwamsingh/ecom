// components/order/LoadingState.tsx
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Processing your order...</h2>
        <p className="text-gray-600 mt-2">Please wait while we prepare your order details.</p>
      </div>
    </div>
  );
};

export default LoadingState;