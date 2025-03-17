"use client";

import React, { useState } from "react";
import axios from "axios";
import { CheckCircle, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/cart/add", {
        productId,
        quantity: 1,
      });

      if (response.data.success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`${className} relative flex items-center justify-center  py-3 rounded-lg text-sm lg:text-base font-semibold text-indigo-600 bg-indigo-100 border border-indigo-700 shadow-md hover:bg-indigo-400 hover:text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        isLoading || isAdded ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-1 h-5 w-5 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : isAdded ? (
        <CheckCircle className="h-4 w-4  mr-1" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-1" />
      )}
      {isAdded ? "Added!" : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
