// components/order/ImportantInformation.tsx
import React from "react";

const ImportantInformation: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-md font-medium text-gray-900">Important Information</h3>
      </div>
      <div className="p-6 text-sm text-gray-600 space-y-2">
        <p>• Order cancellation is available within 24 hours of placing the order.</p>
        <p>• Maximum of 5 products can be ordered at once.</p>
        <p>• Maximum quantity of 5 units per product is allowed.</p>
        <p>• Delivery typically takes 3-5 business days.</p>
        <p>• For any queries, please contact our customer support.</p>
      </div>
    </div>
  );
};

export default ImportantInformation;