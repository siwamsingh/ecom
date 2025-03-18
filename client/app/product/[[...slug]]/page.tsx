import React, { FC } from "react";
import axios from "axios";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import ServerErrorPage from "@/components/Error/ServerError";
import DiscountCodesList from "@/components/products/DiscountCodesList";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import { Check, X, BookOpen, Truck, ImageOff } from "lucide-react";
import { redirect } from 'next/navigation'

interface ProductDetailPageProps {
  searchParams: {
    product_id?: string;
    product_name?: string;
  };
}

const serverUrl = process.env.NEXT_SERVER_URL || "http://localhost:8000";

const extractProductDetails = (description: string) => {
  const details: { [key: string]: string } = {};
  const lines = description.split("\r\n");

  lines.forEach((line) => {
    const [key, value] = line.split(":").map((item) => item.trim());
    if (key && value && key.toLowerCase() !== "keywords") {
      details[key.toLowerCase()] = value;
    }
  });

  return details;
};

const ProductDetailPage: FC<ProductDetailPageProps> = async ({
  searchParams,
}) => {
  const productParams = await searchParams;
  const product_id = productParams.product_id;
  const product_name = productParams.product_name;

    if (!serverUrl) {
      return <ServerErrorPage />;
    }

    if (!product_id) {
      return notFound();
    }

    const cookieStore = await cookies();
    let cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    try {
      const response = await axios.post(
        `${serverUrl}/product/get-one-product`,
        {
          product_id: Number(product_id),
        },
        {
          headers: {
            Cookie: cookieHeader,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        return notFound();
      }

      const product = response.data.data.product;
      if(product.status!=="active"){
        return notFound();
      }
      if(!product_name || product_name!=product.url_slug){
        redirect(`/product?product_id=${product_id}&product_name=${product.url_slug}`)
      }

      const discountResponse = await axios.post(
        `${serverUrl}/discount/get-discount`,
        {
          product_id: Number(product_id),
          status: "active",
          expired: false,
        },
        {
          headers: {
            Cookie: cookieHeader,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const discountCodes: any = discountResponse.data.data.discount || [];

      const details = extractProductDetails(product.description);

      return (
        <div className="mx-auto px-2 sm:px-4 lg:px-4 py-12 bg-white">
          <div className="md:flex gap-5">
            {/* Product Image - Adjusted size */}
            <div className="col-span-6 sm:px-10 sm:min-w-lg h-fit overflow-hidden">
              {product.image_url ? (
                <div className="aspect-auto h-fit relative flex items-center justify-center">
                  <Image
                    src={product.image_url}
                    alt={product.product_name}
                    width={300}
                    height={300}
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 flex items-center">
                    <ImageOff className="h-8 w-8 mr-2" />
                    No image available
                  </span>
                </div>
              )}

              {/* Button Wrapper */}
              <div className="flex w-full mt-4 gap-2">
                <AddToCartButton
                  productId={product._id}
                  className="w-1/2 py-3 text-center bg-indigo-200 text-black rounded-lg font-semibold transition-all duration-200"
                />
                <BuyNowButton
                  productId={product._id}
                  className="w-1/2 py-3 text-center rounded-lg font-semibold transition-all duration-200"
                />
              </div>
            </div>

            {/* Product Details - Expanded to balance image size */}
            <div className="col-span-6 mt-10 lg:mt-0 space-y-8">
              {/* Title and Price */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-4">
                  {product.product_name || "Book name"}
                </h1>
                <div className="flex ">
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{Number(product.price).toFixed(2)}
                  </span>
                  {product.stock_quantity > 0 ? (
                    <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                      <Check className="h-4 w-4 mr-1" />
                      In Stock
                    </span>
                  ) : (
                    <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                      <X className="h-4 w-4 mr-1" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
              <div className="">
                <DiscountCodesList
                  discountCodes={discountCodes}
                  currentPrice={product.price}
                />
              </div>

              {/* Product Description */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                  Book Details
                </h3>
                <div className="space-y-3 flex flex-wrap text-gray-600 text-xs lg:text-base">
                  <div className="space-y-3 w-full sm:w-1/2">
                    <div className="grid grid-cols-3">
                      <span className="col-span-1 font-medium text-gray-900">
                        Author
                      </span>
                      <span className="col-span-2">
                        {details.author || "Unknown"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="col-span-1 font-medium text-gray-900">
                        Genre
                      </span>
                      <span className="col-span-2">
                        {details.genre || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="col-span-1 font-medium text-gray-900">
                        Pages
                      </span>
                      <span className="col-span-2">
                        {details.pages || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="col-span-1 font-medium text-gray-900">
                        Publisher
                      </span>
                      <span className="col-span-2">
                        {details.publisher || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3  w-full sm:w-1/2">
                    <div className="grid grid-cols-3">
                      <span className="col-span-1 font-medium text-gray-900">
                        Language
                      </span>
                      <span className="col-span-2">
                        {details.language || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="col-span-1 font-medium text-gray-900">
                        Format
                      </span>
                      <span className="col-span-2">
                        {details.format || "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="col-span-1 font-medium text-gray-900">
                        Edition
                      </span>
                      <span className="col-span-2">
                        {details.edition || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Availability & Shipping Info */}
              <div className="bg-indigo-50 rounded-xl p-4 flex items-center">
                <Truck className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                <p className="text-sm text-indigo-900">
                  {product.stock_quantity > 0
                    ? "Available for immediate shipping. Orders placed before 2PM ship same day."
                    : "Currently out of stock. Sign in to get notified when this item becomes available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error: any) {
      console.error("Error fetching product data:", error);
      if (error.message && error.message.startsWith('NEXT_REDIRECT')) {
        throw error
      }
      
      return <ServerErrorPage />;
    }
  
};


export default ProductDetailPage;
