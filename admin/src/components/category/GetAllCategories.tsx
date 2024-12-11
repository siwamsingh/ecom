import { toast } from "react-toastify";
import getAllCategoriesApi from "../../apis/categories/getAllCategories.api";
import buildCategoryTree from "../../utility/buildCategoryTree"; // Ensure it correctly builds the tree
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { useDispatch } from "react-redux";
import { setCategories, setCategory } from "../../redux/slices/categorySlice";
import getErrorMsg from "../../utility/getErrorMsg";

import { GrTree } from "react-icons/gr";

type Category = {
  _id: number;
  category_name: string;
  parent_categorie_id: number | null;
  status: string;
  url_slug: string;
  children?: Category[];
};

const CategoryTree: React.FC<{
  categories: Category[];
  first: boolean;
  onClick: () => void;
}> = ({ categories, first = false, onClick }) => {
  const dispatch = useDispatch();

  return (
    <ul
      className={` ${
        first ? "" : "border-l border-gray-800 dark:border-gray-300 ml-[2.7rem]"
      }`}
    >
      {categories.map((category) => (
        <li key={category._id} className=" pt-1 sm:pt-2 mt-3">
          <span
            className={`font-medium text-sm ${
              category.status === "active" ? "text-blue-600" : "text-red-500"
            }  flex items-center gap-2`}
          >
            <div className="flex gap-2">
              <div
                className={`w-6 h-6 ${
                  first ? "" : "border-b border-gray-800 dark:border-gray-300"
                } relative bottom-0`}
              ></div>
              <span
                className="relative top-3 flex gap-2 sm:gap-4 items-center hover:bg-blue-500 hover:bg-opacity-30 hover:cursor-pointer"
                onClick={() => {
                  dispatch(
                    setCategory({
                      _id: category._id,
                      category_name: category.category_name,
                      url_slug: category.url_slug,
                      status: category.status,
                      parent_categorie_id: category.parent_categorie_id,
                    })
                  ),
                    onClick();
                }}
              >
                <div className=" text-sm text-black text-center dark:text-white  h-fit border border-gray-800 dark:border-gray-300 w-6 flex items-center justify-center">
                  {category._id}
                </div>{" "}
                {category.category_name}
              </span>
            </div>
          </span>

          {category.children && category.children.length > 0 && (
            <CategoryTree
              categories={category.children}
              first={false}
              onClick={onClick}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default function GetAllCategories({ onClick }: { onClick: () => void }) {
  const [catTree, setCatTree] = useState<Category[]>([]);

  const dispatch = useDispatch();

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesApi();
      if (response) {
        const categoryTree = buildCategoryTree(response.categories);
        dispatch(setCategories(response.categories));
        setCatTree(categoryTree);
        toast.success("Categories fetched successfully!");
      }
    } catch (error: any) {
      if ((error.status && error?.status === 577) || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        const errorMsg = getErrorMsg(error, 505, "Fetching Categories");
        toast.error(errorMsg);
        console.error(error);
      }
    }
  };
  
  let first = false;

  useEffect(()=>{
    if(first) return;
      getAllCategories();
    first=true;
  },[])

  return (
    <div className="p-0 sm:p-6">
      <button
        className="btn btn-secondary mb-4 p-2 "
        onClick={getAllCategories}
      >
        <GrTree size={20} />
      </button>
      <CategoryTree categories={catTree} first={true} onClick={onClick} />
    </div>
  );
}
