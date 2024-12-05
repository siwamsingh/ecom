import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import updateProductApi from "../../apis/products/updateProduct.api";
import { toast } from "react-toastify";
import getErrorMsg from "../../utility/getErrorMsg";
import { PiPackageLight } from "react-icons/pi";


interface UpdateProductProps {
  product: {
    _id: string;
    product_name: string;
    url_slug: string;
    categorie_id: number | null;
    description: string;
    price: number;
    stock_quantity: number;
    status: string;
    image_url: string;
  };
  onClose: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ product, onClose }) => {
  const [updatedProduct, setUpdatedProduct] = React.useState({
    _id: product._id,
    product_name: product.product_name,
    url_slug: product.url_slug,
    categorie_id: product.categorie_id,
    description: product.description,
    price: product.price,
    stock_quantity: product.stock_quantity,
    status: product.status,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProductApi(updatedProduct);
      toast.success("Products Updated successfully");
    } catch (error: any) {
      if ((error.status && error?.status === 577) || error?.status === 477) {
        toast.error("Session Expired Login Again.");
      } else {
        const errorMsg = getErrorMsg(error, null, "updating product");
        toast.error(errorMsg);
        console.error(error);
      }
    }
  };

  const getCorrectCategoryId = (categorie_id: number | null) => {
    if (categorie_id) return categorie_id;
    else return "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm h-fit text-base sm:text-lg ">
      <div className=" px-2 w-full sm:w-7/12 h-screen overflow-auto">
        <div className="bg-gray-100  dark:bg-gray-800 p-4 rounded-lg shadow-lg focus">
          <div className="mb-6 ">
            <div
              className="relative flex justify-end cursor-pointer"
              onClick={onClose}
            >
              <IoIosCloseCircle size={30} />
            </div>

            <img
              src={product.image_url}
              alt={product.product_name}
              className="overflow-scroll border h-48 object-contain rounded-lg"
            />
          </div>
          <div className="flex h-fit  items-center gap-1 mb-8">
            <h2 className="text-xl sm:text-2xl  font-bold  ">{"Update Product"}</h2>
            <span className="w-fit h-fit ">
              <PiPackageLight size={20}/>
            </span>
            <h2 className="font-semibold text-gray-800 dark:text-gray-400  ">
              {product._id}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="product_name"
                className="block text-sm font-medium"
              >
                Product Name
              </label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                value={updatedProduct.product_name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label htmlFor="url_slug" className="block text-sm font-medium">
                URL Slug
              </label>
              <input
                type="text"
                id="url_slug"
                name="url_slug"
                value={updatedProduct.url_slug}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label
                htmlFor="categorie_id"
                className="block text-sm font-medium"
              >
                Category
              </label>
              <input
                type="text"
                id="categorie_id"
                name="categorie_id"
                value={getCorrectCategoryId(updatedProduct?.categorie_id)}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={updatedProduct.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={updatedProduct.price}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                step="0.01"
              />
            </div>
            <div>
              <label
                htmlFor="stock_quantity"
                className="block text-sm font-medium"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={updatedProduct.stock_quantity}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={updatedProduct.status}
                onChange={handleInputChange}
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
                className="btn btn-outline"
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
    </div>
  );
};

export default UpdateProduct;
