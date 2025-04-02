"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Discount } from "@/lib/features/discounts/discountSlice";
import StoreProvider from "@/app/StoreProvider";

type ProductId = {
  product_id: number;
};

const DiscountBadgeProvider = ({ product_id }: ProductId) => {
    return(<StoreProvider>
      <DiscountBadge product_id={product_id} />
    </StoreProvider>)
  };

const DiscountBadge: React.FC<ProductId> = ({ product_id }) => {
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const { discounts } = useSelector(
    (state: RootState) => state.discount // ✅ FIXED: Corrected Redux selector
  );

  useEffect(() => {
    let maxDiscount = 0;
    discounts.forEach((dis: Discount) => {
      if (
        dis.product_id === product_id &&
        new Date(dis.end_date).getTime() > Date.now() &&
        dis.status==="active" &&
        Number(dis.discount_value) > maxDiscount
      ) {
        maxDiscount = Number(dis.discount_value);
      }
      
    });
    setSelectedDiscount(maxDiscount);
  }, [discounts, product_id]); // ✅ FIXED: Using useEffect to avoid unnecessary re-renders

  if (selectedDiscount === 0) return null; // ✅ FIXED: Hide badge when no discount

  return (
    <div className="absolute top-1 flex items-center justify-center right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-sm p-0.5 font-bold h-8 w-8 rounded-full">
      {selectedDiscount}%
    </div>
  );
};

export {
    DiscountBadgeProvider
}
