// src/components/GetProduct.tsx
import React, { useState, useEffect } from "react";
import {
  getProductsApi,
  GetProductsParams,
} from "../../apis/products/getProducts.api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Product = {
  _id: number;
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

  const categories = useSelector(
    (state: RootState) => state.category.categories
  );

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { products, maxPages } = await getProductsApi(filters);
      console.log(products, maxPages);

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
    setFilters({ ...filters, [name]: value });
  };

  const handlePageChange = (direction: string) => {
    setFilters((prev) => ({
      ...prev,
      page: direction === "next" ? prev.page! + 1 : prev.page! - 1,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);
    if (!categories) return;
  
    const selectedCategoryId = categories.find((cat) => cat._id === categoryId)?. _id || -1;
    setSelectedCategory(selectedCategoryId);
  };
  

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Product List</h1>

      <div className="flex gap-4 mb-6">
        <select
          name="category"
          value={selectedCategory|| -1}
          onChange={handleCategoryChange}
          className="select select-bordered"
        >
          <option key="all" value={-1}>
          All Categories
          </option>
          {categories && categories.map((cat) => (
            (<option key={cat._id} value={cat._id}>
              {cat.category_name}
            </option>)
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={filters.search}
          onChange={handleFilterChange}
          className="input input-bordered w-full sm:w-1/3"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="select select-bordered w-full sm:w-1/6"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {products &&
    products.map((product) => (
      <div
        key={product._id}
        className={`flex items-start p-2 sm:p-4 bg-white dark:bg-gray-800 shadow-md rounded-md border ${
          product.status !== "active" ? "border-red-500" : "border-transparent"
        }`}
      >
        <img
          src={product.image_url}
          alt={product.product_name}
          loading="lazy"
          className="w-24 h-24 object-contain rounded-md flex-shrink-0"
        />
        <div className="ml-2 flex-1 overflow-hidden">
          <h2 className="font-semibold text-lg truncate">{product.product_name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-500 truncate">{product.description.substring(0, 100)}...</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Price: ₹{product.price}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">Stock: {product.stock_quantity}</p>
          <p
            className={`text-sm font-medium ${
              product.status === "active" ? "text-green-600" : "text-red-600"
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
