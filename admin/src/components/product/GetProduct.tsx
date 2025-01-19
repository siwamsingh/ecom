// src/components/GetProduct.tsx
import React, { useEffect, useState } from "react";
import {
  getProductsApi,
  GetProductsParams,
} from "../../apis/products/getProducts.api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CiSearch } from "react-icons/ci";
import UpdateProduct from "./UpdateProduct";

import getAllCategoriesApi from "../../apis/categories/getAllCategories.api";
import { setCategories } from "../../redux/slices/categorySlice";

import { PiPackageLight } from "react-icons/pi";

type Product = {
  _id: string;
  product_name: string;
  url_slug: string;
  categorie_id: number | null;
  description: string;
  price: number;
  stock_quantity: number;
  status: string;
  image_url: string;
};

const GetProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<GetProductsParams>({
    page: 1,
    limit: 10,
    status: "",
    category: undefined,
    search: "",
  });
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );

  const openUpdateModal = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const categories = useSelector(
    (state: RootState) => state.category.categories
  );

  const dispatch = useDispatch();

  const loadCategories = () => {
    const getAllCategories = async () => {
      try {
        const response = await getAllCategoriesApi();
        if (response) {
          dispatch(setCategories(response.categories));
          toast.success("Categories loaded successfully!");
        }
      } catch (error: any) {
        if ((error?.status && error?.status === 577) || error?.status === 477) {
          toast.error("Session Expired Login Again.");
        } else {
          toast.error("Categories not loaded. RELOAD");
        }
      }
    };

    getAllCategories();
  };

  let catLoadOnce = false;

  useEffect(() => {
    if(catLoadOnce) return;
    loadCategories();
    // fetchProducts();  change in filters when category loads will call this below
    catLoadOnce = true;
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products, maxPages } = await getProductsApi(filters);
      setProducts(products);
      setTotalPages(maxPages);
      toast.success("Products loaded successfully");
    } catch (error) {
      toast.error("Failed to load products");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category" && value === "-1") {
      setFilters({ ...filters, [name]: undefined });
    }

    setFilters({ ...filters, [name]: value });
  };

  const handlePageChange = (direction: string) => {
    let pageNum = filters.page;
    if (!pageNum) {
      return;
    }
    if (direction === "next") {
      pageNum++;
    } else {
      if (pageNum === 0) return;
      pageNum--;
    }
    setFilters((prev) => ({ ...prev, page: pageNum }));
  };

  let loadedOnce = false;

  useEffect(() => {
    if (loadedOnce){ 
      loadedOnce = false;
      return;}
    fetchProducts();
    loadedOnce = true;
  }, [filters.page , filters.category , filters.status]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);
    if (!categories) return;

    const selectedCategoryId =
      categories.find((cat) => cat._id === categoryId)?._id || -1;
    setSelectedCategory(selectedCategoryId);

    handleFilterChange(e);
  };

  return (
    <div
      className={`max-w-7xl mx-auto p-4 sm:p-8 ${
        isUpdateModalOpen && "h-[0vh] overflow-clip"
      }`}
    >
      {isUpdateModalOpen && selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
      <h1 className="text-3xl font-bold mb-6">Product List</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          name="category"
          value={selectedCategory || -1}
          onChange={handleCategoryChange}
          className="select select-bordered"
        >
          <option key="all" value={-1}>
            All Categories
          </option>
          {categories &&
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
                {" ( " + cat._id + " ) "}
              </option>
            ))}
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="select select-bordered"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="max-w-md mb-4">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={fetchProducts}
          >
            <CiSearch size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products &&
          products.map((product) => (
            <div
              key={product._id}
              className={`flex items-center p-2 sm:p-4 bg-gray-100 dark:bg-gray-800 shadow-md rounded-md border ${
                product.status !== "active"
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              onClick={() => {
                openUpdateModal(product);
              }}
            >
              <img
                src={product.image_url}
                alt={product.product_name}
                loading="lazy"
                className="w-24 h-24 bg-blue-100 object-contain rounded-md flex-shrink-0 "
              />
              <div className="ml-2 flex-1 overflow-hidden  ">
                <h2 className="font-semibold text-base sm:text-lg ">
                  {product.product_name}
                </h2>
                <div className="flex items-center gap-1">
                  <span className="w-fit ">
                    <PiPackageLight />
                  </span>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-400  text-base sm:text-lg ">
                    {product._id}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-500 mt-1">
                  Price: ₹{product.price}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-500">
                  Stock: {product.stock_quantity}
                </p>
                <p
                  className={`text-sm font-medium ${
                    product.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {product.status}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={filters.page! <= 1}
          className="btn"
        >
          Previous
        </button>
        <span>
          Page {filters.page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={filters.page! >= totalPages}
          className="btn"
        >
          Next
        </button>
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default GetProduct;
