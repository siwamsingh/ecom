import { useState } from "react";
import GetAllCategories from "../components/category/GetAllCategories";
import UpdateCategory from "../components/category/UpdateCategory";
import AddNewCategory from "../components/category/AddNewCategory";
import DeleteCategory from "../components/category/DeleteCategory";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { MdOutlineCategory } from "react-icons/md"; 
import { SiNginxproxymanager } from "react-icons/si";


function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const category = useSelector((state: RootState) => state.category.category);

  return (
    <div className="flex flex-col sm:flex-row h-fit p-2 sm:p-6 bg-base-200 text-base-content sm:gap-3">
      {/* Left Side - Categories Tree */}
      <div className="sm:w-2/5 w-full bg-base-100 p-4 rounded-md shadow-lg mb-4 sm:mb-0">
        <h2 className=" text-lg sm:text-2xl font-bold mb-4 flex gap-2 items-center"><MdOutlineCategory /> Categories 
        </h2>
        <GetAllCategories onClick={() => setShowModal(true)} />
      </div>

      {/* Right Side - Actions */}
      <div className="sm:w-3/5 w-full p-4 bg-base-100 rounded-md shadow-lg space-y-6">
        <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2"><SiNginxproxymanager/>Manage Categories</h2>

        {/* Add New Category */}
        <div>
          <h3 className="text-lg font-medium mb-2">Add New Category</h3>
          <AddNewCategory />
        </div>

        {/* Delete Category */}
        <div className="">
          <h3 className="text-lg font-medium mb-2">Delete Category</h3>
          <div className="flex  justify-center items-center space-x-4">
            <input
              type="number"
              className="input input-bordered w-full sm:w-1/2"
              placeholder="Enter Category ID"
              value={deleteId || ""}
              onChange={(e) => setDeleteId(parseInt(e.target.value))}
            />
            <DeleteCategory _id={deleteId} />
          </div>
        </div>
      </div>

      {/* Update Category Modal */}
      {showModal && category && (
        <UpdateCategory
          _id={category._id}
          category_name={category.category_name}
          url_slug={category.url_slug}
          status={category.status}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Categories;
