import React from "react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product.types";

interface ProductLayoutProps {
  data: {
    page: number;
    limit: number;
    maxPages: number;
    totalCount: number;
    products: Product[];
  };
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ data }) => {
  return (
    <div className="container mx-auto py-10 px-2 sm:p-4 max-w-screen-lg ">

      {data.products.length > 0 ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 gap-y-8 sm:gap-y-4 sm:gap-4">
        {data.products.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>:
      <div className="text-base sm:text-xl min-h-[40vh] font-bold text-slate-400  flex items-center justify-center">
        <p>Item Not Found</p></div>}
    </div>
  );
};

export default ProductLayout;
