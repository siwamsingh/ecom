"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import { RootState } from "@/lib/store";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/features/categories/categorySlice";

type SearchProps = {
  searchParam: string;
  currentCategory: string;
  currentPage: number;
};

const SearchFilterComponent: React.FC<SearchProps> = ({
  searchParam,
  currentCategory,
}) => {
  const router = useRouter();
  
  // Use useState with a function to initialize state only on client
  const [isClient, setIsClient] = useState(false);
  const { categories } = useSelector((state: RootState) => state.category);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Mark component as hydrated after mount
  useEffect(() => {
    setIsClient(true);
    setSearchQuery(searchParam || "");
  }, [searchParam]);

  // Set the selected category after client-side hydration
  useEffect(() => {
    if (isClient && currentCategory && categories.length > 0) {
      const foundCategory = categories.find(
        (cat: any) => cat.url_slug === currentCategory
      );

      if (foundCategory) {
        setSelectedCategory(foundCategory);
      }
    }
  }, [currentCategory, categories, isClient]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUrl = `/products/all-products?category-id=${
      selectedCategory?._id || ""
    }&category=${
      selectedCategory?.url_slug || ""
    }&search=${searchQuery}&page=1`;
    router.push(newUrl);
  };

  // Handle category change
  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
    const newUrl = `/products/all-products?category-id=${
      category?._id || ""
    }&category=${category?.url_slug || ""}&search=${searchQuery}`;
    router.push(newUrl);
  };

  // Check if a category is selected by comparing IDs
  const isCategorySelected = (category: any) => {
    if (!category || !selectedCategory) return false;

    // Convert both to numbers or strings for comparison
    const categoryId = category._id ? category._id.toString() : "";
    const selectedId = selectedCategory._id
      ? selectedCategory._id.toString()
      : "";

    return categoryId === selectedId;
  };

  return (
    <div className="mb-8 sm:px-10">
      {/* Search and Filter Container */}
      <div className="bg-white rounded-lg p-4 sm:flex space-y-4 justify-start items-start gap-6">

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="sm:min-w-[400px]">
          <div className="relative max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 truncate"
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
              <CiSearch size={25} />
            </button>
          </div>
        </form>

        {/* Category Filters */}
        <div>
          <div className="flex gap-4 items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Filter by Genre
            </h3>
            <button onClick={() => setFilterOpen(!filterOpen)}>
              {filterOpen ? (
                <IoIosArrowDropup size={20} />
              ) : (
                <IoIosArrowDropdown size={20} />
              )}
            </button>
          </div>

          {/* Only render category list when client-side hydration is complete */}
          {isClient && (
            <div
              className={`${
                filterOpen ? "block" : "hidden"
              } flex flex-wrap gap-2`}
            >
              <button
                onClick={() =>
                  handleCategoryChange({ _id: "", url_slug: "" })
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory || !selectedCategory._id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                All Genre
              </button>
              {categories.map((category: any) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isCategorySelected(category)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterComponent;