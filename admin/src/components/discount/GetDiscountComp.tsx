import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getAllDiscountsApi from "../../apis/discounts/getDiscounts.api";
import deleteDiscountApi from "../../apis/discounts/deleteDiscount.api";
import getErrorMsg from "../../utility/getErrorMsg";
import UpdateDiscountComp from "./UpdateDiscountComp";

import { RiCoupon2Fill } from "react-icons/ri";
import { PiPackageLight } from "react-icons/pi";


interface Discount {
  _id: number;
  coupon_code: string;
  product_id: number;
  discount_value: number;
  start_date: string;
  end_date: string;
  status: string;
}

const GetDiscountComp: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<"active" | "inactive" | "">("");
  const [showExpired, setShowExpired] = useState(false);

  const [showUpdateComp, setShowUpdateComp] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>({
    _id: 11,
    coupon_code: "test",
    product_id: -1,
    discount_value: -1,
    start_date: "2024-11-04",
    end_date: "2024-12-04",
    status: "active",
  });

  const fetchDiscounts = async () => {
    try {
      const discountFilter = {
        page,
        limit,
        status,
        expired: showExpired,
      };
      const data = await getAllDiscountsApi(discountFilter);
      setDiscounts(data.discounts);
      setTotalPages(data.maxPages);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [page, limit, status, showExpired]);

  const handleDelete = async (discount_id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        if (!discount_id) return;
        await deleteDiscountApi(discount_id);
        toast.success("Discount deleted successfully!");
      } catch (error: any) {
        if ((error.status && error?.status === 577) || error?.status === 477) {
          toast.error("Session Expired Login Again.");
        } else {
          const errMsg = getErrorMsg(error, 401, "delete discount");
          toast.error(errMsg);
          console.error(error);
        }
      }
    }
  };

  const handleUpdate = (discount: Discount) => {
    setShowUpdateComp(true);
    setSelectedDiscount(discount);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {showUpdateComp && selectedDiscount && (
        <div>
          <UpdateDiscountComp
            discountData={selectedDiscount}
            onClose={() => {
              setShowUpdateComp(false);
            }}
          />
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Discounts</h2>
        <div className="flex space-x-4">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "active" | "inactive" | "")
            }
            className="sm:select sm:select-bordered border focus:border-none text-sm "
          >
            <option value="" >All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <label className="flex items-center space-x-2 text-xs sm:text-base">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={() => setShowExpired(!showExpired)}
              className="checkbox"
            />
            <span>Show Expired</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((discount) => (
          <div
            key={discount._id}
            className="card bg-gray-100 dark:bg-gray-800 shadow-lg p-4 rounded-lg transition-all duration-300"
          >
            <div className="flex justify-between">
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 flex  gap-4 dark:text-white">
              {" "}
              <span className="flex items-center gap-2 ">
                <RiCoupon2Fill /> {discount.coupon_code}
              </span>
              <span className="flex items-center gap-2">
                <PiPackageLight />
                {discount.product_id}
              </span>
            </h2>
              <span
                className={`badge ${
                  discount.status === "active" ? "badge-success" : "badge-error"
                }`}
              >
                {discount.status}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-sm">
              Discount: {discount.discount_value}%
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-sm">
              Start Date: {new Date(discount.start_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-sm">
              End Date: {new Date(discount.end_date).toLocaleDateString()}
            </p>

            <div className="mt-4 flex justify-between">
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={() => handleDelete(discount._id)}
              >
                Delete
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleUpdate(discount)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="btn btn-outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GetDiscountComp;
