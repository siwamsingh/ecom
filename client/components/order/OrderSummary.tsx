// components/order/OrderSummary.tsx
import React from "react";
import { ShoppingBag, Package } from "lucide-react";
import { Product, OrderItem } from "./types";

interface OrderSummaryProps {
  orderItems: OrderItem[];
  products: Product[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ orderItems, products }) => {
  return (
    <>
      <div className="px-6 py-4 bg-blue-600 text-white flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>

      {/* Order items */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Items ({orderItems.length})</h3>
        <div className="space-y-4">
          {orderItems.map((item, index) => {
            const product = products.find(p => Number(p._id) === item.product_id);
            if (!product) return null;
            
            return (
              <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.product_name} className="w-full h-full object-contain rounded-md" />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{product.product_name}</h4>
                  <p className="text-sm sm:text-base text-gray-900 truncate">x {item.quantity}</p>
                  {product.stock_quantity < 10 && (
                    <p className="text-xs text-amber-600">Only {product.stock_quantity} left in stock</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base font-medium text-gray-900">₹{(Number(item.price )* Number(item.quantity)).toFixed(2)}</p>
                  <p className="text-xs sm:text-sm text-gray-500">₹{Number(item.price).toFixed(2)} each</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OrderSummary;