import React, { useState } from "react";
import { Tag, Check } from "lucide-react";
import { Address, Product } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Discount } from "@/app/discounts/page";

interface OrderDetailsProps {
  addresses: Address[];
  products: Product[];
  selectedAddress: number | null;
  handleAddressChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCouponChange: (selectedCoupon: Discount) => void;
  totalAmount: number;
  discountAmount: number;
  grossAmount: number;
  orderPlaced: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  addresses,
  products,
  selectedAddress,
  handleAddressChange,
  handleCouponChange,
  totalAmount,
  discountAmount,
  grossAmount,
  orderPlaced,
}) => {
  // 🔥 Get coupons from Redux store
  const coupons = useSelector((state: RootState) => state.discount.discounts);

  // Get current date
  const currentDate = new Date();
  const productIdsSet = new Set(products.map((product: Product) => Number(product._id)));

  // Filter valid coupons
  const validCoupons = coupons.filter((coupon: Discount) => {
    const expiryDate = new Date(coupon.end_date);
    return (
      coupon.status === "active" &&
      expiryDate >= currentDate &&
      productIdsSet.has(coupon.product_id)
    );
  });
  

  const [selectedCoupon, setSelectedCoupon] = useState("");

  const handleCouponSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const couponCode = e.target.value;
    setSelectedCoupon(couponCode);

    const selectedCouponObj = coupons.find(
      (coupon) => coupon.coupon_code === couponCode
    );

    if (selectedCouponObj) {
      handleCouponChange(selectedCouponObj);
    }
  };

  return (
    <div className="p-6">
      {!orderPlaced && (
        <>
          {/* Shipping address */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Shipping Address
            </h3>
            {addresses.length > 0 ? (
              <div className="flex flex-col space-y-3">
                <select
                  value={selectedAddress || ""}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  disabled={orderPlaced}
                >
                  <option value="" disabled>
                    Select a shipping address
                  </option>
                  {addresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.pincode}, {address.area}, {address.town_or_city},{" "}
                      {address.state} {" - "} {address.specific_location}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-4">

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-700 text-sm">
                  No saved addresses found. Click here to <a href="/address/add" className="text-blue-500 underline">add address</a>
                </p>
              </div>
              <div>
              <a href="/address/add" className="text-white bg-blue-400 rounded-sm shadow-sm font-semibold p-1 m-4">Add Address</a>
              </div>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Apply Coupon
            </h3>
            {validCoupons.length > 0 ? (
              <div className="flex flex-col space-y-3">
                <select
                  value={selectedCoupon}
                  onChange={handleCouponSelect}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  disabled={orderPlaced}
                >
                  <option value="">No coupon selected</option>
                  {validCoupons.map((coupon) => {
                    const applicableProduct = products.find(
                      (p) => Number(p._id) === coupon.product_id
                    );
                    return (
                      <option
                        key={coupon.coupon_code}
                        value={coupon.coupon_code}
                      >
                        {coupon.coupon_code} - {coupon.discount_value}% off
                        {applicableProduct
                          ? ` on ${applicableProduct.product_name}`
                          : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No coupons available at this time
              </p>
            )}
          </div>
        </>
      )}

      {/* Price details */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Price Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <p className="text-gray-600">Total MRP</p>
            <p className="text-gray-900">₹{totalAmount.toFixed(2)}</p>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <p className="text-gray-600 flex items-center">
                <Tag className="h-4 w-4 mr-1 text-green-600" />
                Coupon Discount
              </p>
              <p className="text-green-600">- ₹{discountAmount.toFixed(2)}</p>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
            <p className="text-gray-900">Total Amount</p>
            <p className="text-gray-900">₹{grossAmount.toFixed(2)}</p>
          </div>
        </div>

        {discountAmount > 0 && (
          <div className="mt-4 bg-green-50 rounded-md p-3 flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
            <p className="text-xs sm:text-sm text-green-800">
              You&apos;re saving ₹{discountAmount.toFixed(2)} with the applied
              coupon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
