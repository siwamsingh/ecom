import { toast } from "react-toastify";
import getAllCategoriesApi from "../../apis/categories/getAllCategories.api";
import buildCategoryTree from "../../utility/buildCategoryTree"; // Ensure it correctly builds the tree
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { useDispatch } from "react-redux";
import { setCategories, setCategory } from "../../redux/slices/categorySlice";
import getErrorMsg from "../../utility/getErrorMsg";

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
    <ul className={`pl-6 mb-8  ${first ? "" : "border-l border-gray-300"}`}>
      {categories.map((category) => (
        <li key={category._id} className="my-2">
          <span
            className={`font-medium text-lg ${
              category.status === "active" ? "text-blue-600" : "text-red-500"
            } hover:text-blue-800 hover:cursor-pointer`}
            onClick={() => {
              dispatch(
                setCategory({
                  _id: category._id,
                  category_name: category.category_name,
                  url_slug: category.url_slug,
                  status: category.status,
                  parent_categorie_id: category.parent_categorie_id
                })
              ),
                onClick();
            }}
          >
            {category._id + " . " + category.category_name}
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

  const dispatch = useDispatch()

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesApi();
      if (response) {
        const categoryTree = buildCategoryTree(response.categories);
        dispatch(setCategories(response.categories))
        setCatTree(categoryTree);
        toast.success("Categories fetched successfully!");
      }
    } catch (error: any) {
      if (error.status &&  error?.status === 577 || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        const errorMsg = getErrorMsg(error, 505, "Fetching Categories");
        toast.error(errorMsg);
        console.error(error);
      }
    }
  };

  return (
    <div className="p-0 sm:p-6">
      <button className="btn btn-secondary mb-4" onClick={getAllCategories}>
        Click to get categories
      </button>
      <CategoryTree categories={catTree} first={true} onClick={onClick} />
    </div>
  );
}
