"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";

type PaginationProps = {
  searchParam: string;
  currentCategory: string;
  currentCategoryId: number;
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  searchParam,
  currentPage,
  currentCategory,
  currentCategoryId,
  totalPages
}: PaginationProps) {
  const [page, setPage] = useState(Math.round(currentPage)); // Ensure integer
  const router = useRouter();

  // Update local state when props change
  useEffect(() => {
    setPage(Math.round(currentPage)); // Ensure integer
  }, [currentPage]);

  const onPageChange = (pageNumber: number) => {
    // Ensure pageNumber is always an integer
    const intPage = Math.round(pageNumber);
    const newUrl = `/products/all-products?category_id=${currentCategoryId || ""}&category=${
      currentCategory || ""
    }&search=${searchParam}&page=${intPage}`;
    router.push(newUrl);
  };

  const goToPage = (pageNumber: number) => {
    // Ensure pageNumber is always an integer
    const intPage = Math.round(pageNumber);
    if (intPage >= 1 && intPage <= totalPages) {
      setPage(intPage);
      onPageChange(intPage);
    }
  };

  const renderPageButtons = () => {
    if (totalPages <= 1) return null;
    
    const buttons = [];
    const maxVisible = 5;
    
    // Calculate visible page range (always using integers)
    let start = 1;
    let end = totalPages;
    
    if (totalPages > maxVisible) {
      // Calculate midpoint
      const midPoint = Math.round(maxVisible / 2);
      
      if (page <= midPoint) {
        // Near start
        start = 1;
        end = maxVisible;
      } else if (page > totalPages - midPoint) {
        // Near end
        start = totalPages - maxVisible + 1;
        end = totalPages;
      } else {
        // Middle
        start = page - midPoint + 1;
        end = page + midPoint - 1;
      }
      
      // Ensure start and end are always integers
      start = Math.max(1, Math.round(start));
      end = Math.min(totalPages, Math.round(end));
    }
    
    // First page button
    if (start > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => goToPage(1)}
          className="hidden sm:flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft size={18} />
        </button>
      );
    }
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
    );
    
    // Page number buttons
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`flex items-center justify-center w-10 h-10 rounded-lg shadow-sm font-medium transition-colors ${
            page === i
              ? "bg-primary text-white border border-primary"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
          aria-label={`Page ${i}`}
          aria-current={page === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    );
    
    // Last page button
    if (end < totalPages) {
      buttons.push(
        <button
          key="last"
          onClick={() => goToPage(totalPages)}
          className="hidden sm:flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight size={18} />
        </button>
      );
    }
    
    return buttons;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center space-y-4 my-8">
      <div className="flex items-center gap-2">
        {renderPageButtons()}
      </div>
      
      <p className="text-sm text-gray-500 font-medium">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}