import React from "react";

interface DiscountCode {
  _id: number;
  coupon_code: string;
  description: string;
  discount_value: number;
  end_date: string;
  start_date: string;
  status: string;
  product_id: number;
}

type CurrentPrice = number;

interface DiscountCodesListProps {
  discountCodes: DiscountCode[];
  currentPrice: CurrentPrice;
}

const DiscountCodesList: React.FC<DiscountCodesListProps> = ({ discountCodes = [], currentPrice }) => {
  const calculateDiscountedPrice = (discountValue: number): number => {
    const discountAmount = (currentPrice * discountValue) / 100;
    return Math.round(currentPrice - discountAmount);
  };

  return (
    <div className="mt-6 space-y-4">
      {discountCodes.length > 0 ? (
        discountCodes.map((discount) => {
          const finalPrice = calculateDiscountedPrice(discount.discount_value);
          return (
            <div
              key={`discount-${discount._id}`}
              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-base font-semibold text-gray-900">{discount.description}</p>
                  <p className="text-sm text-gray-500">
                    Save <span className="font-medium">{Math.round(discount.discount_value)}%</span> (up to <span className="font-medium">₹{Math.round((currentPrice * discount.discount_value) / 100)}</span>)
                  </p>
                  <p className="text-xs text-gray-500">
                    Valid until <span className="font-medium">{new Date(discount.end_date).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md border border-indigo-300">
                    <code className="text-sm font-bold">{discount.coupon_code}</code>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Final Price: <span className="font-semibold text-green-600">₹{finalPrice}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No discount codes available.</p>
      )}
    </div>
  );
};

export default DiscountCodesList;
