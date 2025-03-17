"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product.types";

interface ProductCarouselClientProps {
  title: string;
  products: Product[];
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 764 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tabletSmall: {
    breakpoint: { max: 764, min: 464 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const ProductCarouselClient: React.FC<ProductCarouselClientProps> = ({
  title,
  products,
}) => {
  return (
    <div className="container mx-auto py-6 px-2 sm:p-4 max-w-screen-lg">
   <h2 className="text-xl sm:text-2xl italic mb-4 text-gray-800 font-[var(--font-dancing-script)]">
  {title}
</h2>


      <div className="relative">
        <Carousel
          swipeable={true}
          draggable={true}
          responsive={responsive}
          infinite={false}
          autoPlay={false}
        //   autoPlaySpeed={2500}
          keyBoardControl={true}
          transitionDuration={300}
          customTransition="transform 300ms ease-in-out"
          containerClass="carousel-container "
          arrows={true}
        >
          {products.map((product) => (
            <div key={product._id} className="px-2 h-[100%]">
              <ProductCard {...product} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductCarouselClient;
