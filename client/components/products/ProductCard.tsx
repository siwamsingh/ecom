import React from "react";
import { Product } from "@/types/product.types";
import { Link, ShoppingCart, Tag } from "lucide-react";
import NextLink from "next/link";
import Button from "../common/Button";
import { DiscountBadgeProvider } from "./DiscountBadge";
import AddToCartButton from "../cart/AddToCartButton";

const ProductCard = (product: Product) => {
  return (
    <NextLink
    href={`/product?product_id=${product._id}&product_name=${product.url_slug}`}

      key={product._id}
      className="group relative flex flex-col h-full rounded-lg overflow-hidden transition-all duration-300 hover:border-b-indigo-600 border-b-white border-b-2"
    >
      <div className="relative bg-slate-50 sm:p-4 flex justify-center">
        <img
          src={product.image_url}
          alt={product.product_name}
          loading="lazy"
          className="h-48 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        <div className="">
          <DiscountBadgeProvider product_id={Number(product._id)} />
        </div>
      </div>  

      {/* Product Details */}
      <div className="sm:p-4 h-full flex flex-col justify-end flex-1">
        {/* Product Name */}
        <h2 className="font-semibold text-gray-800 text-sm sm:text-lg line-clamp-2 min-h-[2.5rem]">
          {product.product_name}
        </h2>

        {/* Price Section */}
        <div className="flex items-center mt-1 sm:mt-2">
          <Tag className="w-4 h-4 text-indigo-600 mr-1" />
          <span className="font-bold text-base sm:text-lg text-red-600">
            ₹{product.price}
          </span>
        </div>

        {/* Stock Indicator */}
        {product.stock_quantity > 0 ? (
          <span className="text-xs sm:text-sm text-green-600 mt-1">In Stock</span>
        ) : (
          <span className="text-xs sm:text-sm text-red-500 mt-1">Out of Stock</span>
        )}

        {/* Add to Cart Button */}
        <AddToCartButton productId={product._id}  className={`mt-1 sm:mt-3 flex items-center justify-center rounded-md px-1 py-1 text-[12px] sm:px-4 sm:py-2 sm:text-sm lg:text-sm font-medium  
            ${
              product.stock_quantity > 0
                ? "text-indigo-600 bg-indigo-100 hover:text-white border-none hover:bg-indigo-700"
                : "text-white bg-gray-400 cursor-not-allowed"
            }`}/>
      </div>
    </NextLink>
  );
};

export default ProductCard;
