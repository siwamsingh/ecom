"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  productId: string;
  className?: string;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ productId, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      router.push(`/order/confirm?products=${productId}:1`);
    } catch (error) {
      console.error("Error processing buy now:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={isLoading}
      className={`${className} relative flex items-center justify-center px-2 py-3 rounded-lg text-sm sm:text-base font-semibold text-gray-900 bg-yellow-400 border border-yellow-500 shadow-md hover:bg-yellow-500 hover:text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 ${
        isLoading ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {isLoading ? "Processing..." : "Buy Now"}
    </button>
  );
};

export default BuyNowButton;
