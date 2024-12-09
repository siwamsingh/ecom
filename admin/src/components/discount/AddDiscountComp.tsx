import React, { useState } from "react";
import { toast } from "react-toastify";
import addDiscountApi from "../../apis/discounts/addDiscount.api";
import getErrorMsg from "../../utility/getErrorMsg";

import { MdDiscount } from "react-icons/md";




const AddDiscountComp: React.FC = ({}) => {
  const [discount, setDiscount] = useState({
    coupon_code: "",
    product_id: 0,
    discount_value: 1,
    start_date: "",
    end_date: "",
    status: "active",
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

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (discount.discount_value < 1 || discount.discount_value > 100) {
      toast("Discount value must be between 1 and 100.");
      return;
    }else{
      try {
        await addDiscountApi(discount);
        toast.success("Discount added successfully!");
      } catch (error: any) {
        if (error.status &&  error?.status === 577 || error?.status === 477) {
          toast.error("Session Expired Login Again.");
        } else {
          const errorMsg = getErrorMsg(error, null, "adding product");
          toast.error(errorMsg);
          console.error(error);
        }
      } 
    }
  };

  

  return (
    <div className="max-w-2xl mx-auto sm:p-8 shadow-md bg-gray-100 dark:bg-base-100 rounded-lg">
      <div className=" p-4 sm:p-8 mx-auto  rounded-lg max-w-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 sm:gap-4"><MdDiscount/>Add Discount</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="coupon_code" className="block text-sm font-medium">
              Coupon Code
            </label>
            <input
              type="text"
              id="coupon_code"
              name="coupon_code"
              value={discount.coupon_code}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="product_id" className="block text-sm font-medium">
              Product ID
            </label>
            <input
              type="number"
              id="product_id"
              name="product_id"
              value={discount.product_id}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
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
              value={discount.start_date}
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
              value={discount.end_date}
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
            <button type="submit" className="btn btn-primary">
              Add Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDiscountComp;
