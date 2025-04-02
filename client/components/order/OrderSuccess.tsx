// components/order/OrderSuccess.tsx
import React from "react";
import { Check } from "lucide-react";

interface OrderSuccessProps {
  orderId?: string | number;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center my-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">Order Placed Successfully!</h2>
      <p className="text-gray-600 mt-2">Your order #{orderId} has been confirmed.</p>
      <p className="text-gray-600 mt-1">Please proceed with the payment to complete your purchase.</p>
    </div>
  );
};

export default OrderSuccess;