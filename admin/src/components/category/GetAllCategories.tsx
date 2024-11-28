import { toast, ToastContainer } from "react-toastify";
import getAllCategoriesApi from "../../apis/categories/getAllCategories.api";
import buildCategoryTree from "../../utility/buildCategoryTree"; // Ensure it correctly builds the tree
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { useDispatch } from "react-redux";
import { setCategory } from "../../redux/slices/categorySlice";

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
            className="font-medium text-lg text-blue-600 hover:text-blue-800 hover:cursor-pointer"
            onClick={() => {
              dispatch(
                setCategory({
                  _id: category._id,
                  category_name: category.category_name,
                  url_slug: category.url_slug,
                  status: category.status,
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

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesApi();
      if (response) {
        console.log(response);
        
        const categoryTree = buildCategoryTree(response.categories);
        setCatTree(categoryTree);
        toast.success("Categories fetched successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error while fetching categories.");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <button className="btn btn-secondary mb-4" onClick={getAllCategories}>
        Click to get categories
      </button>
      <CategoryTree categories={catTree} first={true} onClick={onClick} />
    </div>
  );
}
