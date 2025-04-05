import React from "react";
import axios from "axios";
import ServerErrorPage from "@/components/Error/ServerError";
import ProductLayout from "@/components/products/ProductLayout";
import SearchFilterProvider from "@/components/products/SearchFilterProvider";
import Pagination from "@/components/products/Pagination";
import MainLayout from "@/app/MainLayout";
import { Metadata } from "next";


type tParams = Promise<{
  category?: string;
  search?: string;
  "category-id": number;
  page: number;
}>

const serverUrl = process.env.NEXT_SERVER_URL || "http://localhost:8000";

export async function generateMetadata({
  searchParams
}: {searchParams: tParams}):Promise<Metadata> {
  const params = await searchParams;
  const category = params.category || ""; 
  const search = params.search || ""; 
  const page = Number(params.page) || 1;

  let categoryName = category;

  if(category===""){
    categoryName = "All"
  }
  
  return{
    title: "Category : "+categoryName+", Searched Text : "+search+", Page : "+page,
    description: "Page "+page+" of Products with Category "+categoryName+" and searched text : '"+search+"'",
  }
}


const AllProducts = async ({ searchParams }: {searchParams: tParams}) => {

  const params = await searchParams;
  const category = params.category || ""; // Default to "All" if not provided
  const search = params.search || ""; // Default empty string if not provided
  const category_id = params["category-id"] || null;
  let page = Number(params.page) || 1;

  const pageLimit = 4;

  async function fetchProducts() {
    try {
      const response = await axios.post(
        `${serverUrl}/product/get-product`,
        {
          page,
          category: category_id,
          status: "active",
          limit: pageLimit,
          search,
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

  async function handelFetchProduct() {
    if (!serverUrl) {
      return <ServerErrorPage />;
    }


    try {
      const result = await fetchProducts();

      const totalCount = result.data.totalCount;
      let totalPages = 1;

      if (pageLimit && totalCount % pageLimit === 0) {
        totalPages = totalCount / pageLimit;
      } else {
        if (pageLimit) {
          totalPages = Math.ceil(totalCount / pageLimit);
        }
      }

      if(page>totalPages){
        page=1;
      }

      return (
        <MainLayout>
        <div>
          <SearchFilterProvider
            searchParam={Array.isArray(search) ? search?.[0] : search || ""}
            currentCategory={Array.isArray(category) ? category[0] : category || ""}
            currentPage={page || 1}
          />

          <ProductLayout data={result.data} />
          <Pagination
            searchParam={Array.isArray(search) ? search?.[0] : search || ""}
            currentCategory={Array.isArray(category) ? category[0] : category|| ""}
            currentCategoryId={Number(category_id)}
            currentPage={page || 1}
            totalPages={totalPages}
          />
        </div>
        </MainLayout>
      );

    } catch {
      return <ServerErrorPage />;
    }
  }

  return await handelFetchProduct();
};

export default AllProducts;
