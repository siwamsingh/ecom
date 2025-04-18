import React, { cache } from "react";
import axios from "axios";
import { notFound } from "next/navigation";
import Image from "next/image";
import ServerErrorPage from "@/components/Error/ServerError";
import DiscountCodesList from "@/components/products/DiscountCodesList";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import { Check, X, BookOpen, Truck, ImageOff } from "lucide-react";
import { redirect } from 'next/navigation'
import MainLayout from "@/app/MainLayout";
import ProductCarousel from "@/components/products/ProductCarousel";
import { Metadata } from "next";

type tParams = Promise<{
  "product-id"?: string;
  "product-name"?: string;
}>

const serverUrl = process.env.NEXT_SERVER_URL || "http://localhost:8000";

const getProduct = cache(async (product_id: string)=>{
  const response = await axios.post(
    `${serverUrl}/product/get-one-product`,
    {
      product_id: Number(product_id),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  if (!response.data.success) {
    return notFound();
  }

  const product = response.data.data.product;

  return product;
})


export async function generateMetadata({
  searchParams
}: {searchParams: tParams}):Promise<Metadata> {
  const productParams = await searchParams;
  const product_id = productParams["product-id"];

  if(!product_id){
    return {
      title: "Failed to fetch product"
    }
  }
const product = await getProduct(product_id);

  let description = product.description;
  description = description.replace("\r\n",", ");

  
  return{
    title: product.product_name,
    description: description,
    openGraph:{
      images:[
        {
          url: product.image_url,
          width: 1200,
          height: 630,
        alt: product.product_name
        }
      ]
    }
  }
}

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

const ProductDetailPage = async ({
  searchParams
}: {searchParams: tParams}) => {
  const productParams = await searchParams;
  const product_id = productParams["product-id"];
  const product_name = productParams["product-name"];

    if (!serverUrl) {
      return <ServerErrorPage />;
    }

    if (!product_id) {
      return notFound();
    }

    try {
      const product = await getProduct(product_id);
      
      if(product.status!=="active"){
        return notFound();
      }
      if(!product_name || product_name!=product.url_slug){
        redirect(`/product?product-id=${product_id}&product-name=${product.url_slug}`)
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
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const discountCodes: any = discountResponse.data.data.discount || [];

      const details = extractProductDetails(product.description);

      return (
        <MainLayout>
        <div className="mx-auto max-w-screen-xl px-2 sm:px-4 lg:px-4 py-12 bg-white">

          <div className="md:flex gap-5 justify-center items-center  lg:min-h-[60vh]">
            {/* Product Image - Adjusted size */}
            <div className="lg:w-5/12 sm:px-10 md:px-4 lg:px-10 sm:min-w-lg h-fit overflow-hidden">
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
            <div className="lg:w-7/12 mt-10 md:mt-0 space-y-8">
              {/* Title and Price */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-4 max-w-xl">
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
              <div className="lg:max-w-xl">
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

             
            </div>
          </div>

           {/* Stock Availability & Shipping Info */}
           <div className="bg-indigo-50 max-w-screen-lg my-8 mx-auto justify-center px-6 rounded-xl p-4 flex items-center">
                <Truck className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                <p className="text-sm text-indigo-900">
                  {product.stock_quantity > 0
                    ? "Available for immediate shipping. Orders placed before 2PM ship same day."
                    : "Currently out of stock. Sign in to get notified when this item becomes available."}
                </p>
              </div>

          <div className="max-w-[1180px] mx-auto">

          <ProductCarousel 
        title="Similar Books" 
        category_id={product.categorie_id || null}
        />
        </div>
        </div>
        
        </MainLayout>
      );
    } catch (error: any) {
      if (error.message && error.message.startsWith('NEXT_REDIRECT')) {
        throw error
      }
      
      return <ServerErrorPage />;
    }
  
};


export default ProductDetailPage;
