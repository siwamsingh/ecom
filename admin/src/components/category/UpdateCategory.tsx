import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import slugify from "react-slugify";
import updateCategoryApi from "../../apis/categories/updateCategory.api";
import getErrorMsg from "../../utility/getErrorMsg";

type UpdateCategoryProps = {
  _id: number | undefined;
  category_name: string | undefined;
  url_slug: string | undefined;
  status: string | undefined;
  onClose: () => void; // to close the modal
};

const UpdateCategory: React.FC<UpdateCategoryProps> = ({
  _id,
  category_name,
  url_slug,
  status,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    _id,
    category_name,
    url_slug,
    status,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;

    if (name === "url_slug") {
      value = slugify(value); // Convert to slug format
    }

    if (name === "category_name") {
      // Auto-generate slug from category name when it changes
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        url_slug: slugify(value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
      formData._id = _id;
      const response = await updateCategoryApi(formData);
      if (response) {
        toast.success("Category updated successfully!");
      } else {
        toast.error(response.message || "Error updating category.");
      }
    } catch (error: any) {
      if (error.status &&  error?.status === 577 || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        const errorMsg = getErrorMsg(error, 401, "updating category");
        toast.error(errorMsg);
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Update Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL Slug</label>
            <input
              type="text"
              name="url_slug"
              value={formData.url_slug}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
