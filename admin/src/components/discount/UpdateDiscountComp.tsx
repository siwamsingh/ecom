import React, { useState } from "react";
import { RiCoupon2Fill } from "react-icons/ri";
import { PiPackageLight } from "react-icons/pi";
import updateDiscountApi from "../../apis/discounts/updateDiscount.api";
import { toast } from "react-toastify";
import getErrorMsg from "../../utility/getErrorMsg";

interface UpdateDiscountCompProps {
  discountData: {
    _id: number;
    coupon_code: string;
    product_id: number;
    discount_value: number;
    start_date: string;
    end_date: string;
    status: string;
  };
  onClose: () => void;
}

const UpdateDiscountComp: React.FC<UpdateDiscountCompProps> = ({
  discountData,
  onClose,
}) => {
  const [discount, setDiscount] = useState({
    _id: discountData._id,
    discount_value: discountData.discount_value,
    start_date: discountData.start_date,
    end_date: discountData.end_date,
    status: discountData.status,
  });

  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDiscount({
      ...discount,
      [e.target.name]:
        e.target.name === "product_id" || e.target.name === "discount_value"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!discount) return;
    try {
      const response = await updateDiscountApi(discount);
      if (response) {
        toast.success("Category updated successfully!");
      }
    } catch (error: any) {
      if ((error.status && error?.status === 577) || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        const errorMsg = getErrorMsg(error, 401, "updating discount");
        toast.error(errorMsg);
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50   backdrop-blur-sm">
      <div className="input-bordered p-8 rounded-lg shadow-lg w-full max-w-xl h-screen overflow-scroll bg-gray-300 dark:bg-gray-800">
        <div className="">
          <h2 className="text-2xl font-bold mb-4">Update Discount</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex  gap-6">
              {" "}
              <span className="flex items-center gap-2">
                <RiCoupon2Fill /> {discountData.coupon_code}
              </span>
              <span className="flex items-center gap-2">
                <PiPackageLight />
                {discountData.product_id}
              </span>
            </h2>
            <div>
              <label
                htmlFor="discount_value"
                className="block text-sm font-medium"
              >
                Discount Value (%)
              </label>
              <input
                type="number"
                id="discount_value"
                name="discount_value"
                value={discount.discount_value}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                min={1}
                max={100}
                required
              />
            </div>
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={(() => {
                  const date = new Date(discount.start_date);
                  date.setDate(date.getDate() + 1); // Add one day
                  return date.toISOString().split("T")[0];
                })()}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium">
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={(() => {
                  const date = new Date(discount.end_date);
                  date.setDate(date.getDate() + 1); // Add one day
                  return date.toISOString().split("T")[0];
                })()}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={discount.status}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Discount
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDiscountComp;
