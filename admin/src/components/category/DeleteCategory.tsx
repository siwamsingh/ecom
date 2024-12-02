import React from "react";
import deleteCategoryApi from "../../apis/categories/deleteCategory.api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getErrorMsg from "../../utility/getErrorMsg";

type DeleteCategoryProps = {
  _id: number | null;
};

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ _id }) => {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        if (!_id) return;
        await deleteCategoryApi(_id);
        toast.success("Category deleted successfully!");
      } catch (error: any) {
        if (error.status &&  error?.status === 577 || error?.status === 477) {
          toast.error("Session Expired Login Again.");
        } else {
          const errMsg = getErrorMsg(error, 401, "delete category");
          toast.error(errMsg);
          console.error(error);
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <button
        onClick={handleDelete}
        className="btn btn-error text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
      >
        Delete Category
      </button>
    </div>
  );
};

export default DeleteCategory;
