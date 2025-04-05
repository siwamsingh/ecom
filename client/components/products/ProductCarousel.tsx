import React from "react";
import { Product } from "@/types/product.types";
import ServerErrorPage from "../Error/ServerError";
import axios from "axios";
import ProductCarouselClient from "./ProductCarouselClient";

interface ProductCarouselProps {
  category_id?: number;
  title?: string;
  limit?: number;
}

const serverUrl = process.env.NEXT_SERVER_URL || "http://localhost:8000";

const ProductCarousel: React.FC<ProductCarouselProps> = async ({
  category_id,
  title = "Featured Products",
  limit = 10,
}) => {
  if (!serverUrl) {
    return <ServerErrorPage />;
  }

  async function fetchProducts() {
    try {
      
      const response = await axios.post(
        `${serverUrl}/product/get-product`,
        {
          page: 1,
          category: category_id || null,
          status: "active",
          limit: limit,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );


      return response.data;
    } catch (error) {
      throw error;
    }
  }

  try {
    const result = await fetchProducts();
    const products: Product[] = result.data.products;

    if (!products || products.length === 0) {
      return (
        <div className="text-base sm:text-xl min-h-[20vh] font-bold text-slate-400 flex items-center justify-center">
          <p>No Products Available</p>
        </div>
      );
    }

    // Pass data to the client component
    return <ProductCarouselClient title={title} products={products} />;
  } catch  {
    return <div className="container mx-auto py-6 px-2 sm:p-4 w-full">
    <div className="h-6 sm:h-8 w-40 bg-gray-300 rounded-sm animate-pulse mb-4"></div>
  
    <div className="relative p-4 bg-gray-200 rounded-lg animate-pulse">
      <div className="grid h-48 overflow-clip grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="h-48 max-w-44  bg-gray-300 rounded-md animate-pulse"
            />
          ))}
      </div>
    </div>
  </div>
  
  }
};

export default ProductCarousel;
