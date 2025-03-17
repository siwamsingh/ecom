import React from "react";
import { Product } from "@/types/product.types";
import ProductCard from "./ProductCard";
import ServerErrorPage from "../Error/ServerError";
import axios from "axios";
import { cookies } from "next/headers";
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
      const cookieStore = await cookies();
      let cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

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
            Cookie: cookieHeader,
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
  } catch (error: any) {
    console.error("Error fetching carousel products:", error);
    return <ServerErrorPage />;
  }
};

export default ProductCarousel;
