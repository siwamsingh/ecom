export const dynamic = 'force-dynamic';

import { Category } from "@/lib/features/categories/categorySlice";
import { Product } from "@/types/product.types";
import axios from "axios";
import { MetadataRoute } from "next";

const serverUrl = process.env.NEXT_SERVER_URL || "http://localhost:8000";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL|| "http://localhost:3000";

export default async function sitemap():Promise<MetadataRoute.Sitemap> {
    
    async function fetchProducts() {
        try {
          const response = await axios.post(
            `${serverUrl}/product/get-product`,
            {
              page: 1,
              limit: null
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
    
          return response.data.data.products;
        } catch {
          return [];
        }
      }

      async function fetchCategories() {
          try {
            const response = await axios.post(
                `${baseUrl}/api/category/get-categories`,
                {
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );
            return response.data.data.categories; 
          } catch {
            return []
          }
        }
      
        const categories: Category[] = await fetchCategories();

        const categoryEntries:MetadataRoute.Sitemap = categories.map((category)=>{
            return{
                url:`${baseUrl}/products/all-products?category_id=${category._id}&amp;category=${category.url_slug}&amp;search=`
            }
          })

      const products: Product[] = await fetchProducts();

      

      const productEntries:MetadataRoute.Sitemap = products.map((product)=>{
        return{
            url:`${baseUrl}/product?product_id=${product._id}&amp;product_name=${product.url_slug}`
        }
      })

    return [
        {
            url:`${baseUrl}`
        },
        {
            url:`${baseUrl}/about`
        },
        {
            url:`${baseUrl}/privacy-policy`
        },
        {
            url:`${baseUrl}/terms-and-conditions`
        },
        {
            url:`${baseUrl}/contact`
        },
        {
            url: `${baseUrl}/discounts`
        },
        ...productEntries,
        {
            url: `${baseUrl}/products/all-products?category_id=&amp;category=&amp;search=`
        },
        ...categoryEntries
    ]
}