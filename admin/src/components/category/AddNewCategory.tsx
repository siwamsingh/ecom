import React, { useState } from 'react';
import { toast } from 'react-toastify';
import slugify from 'react-slugify'; // Importing slugify
import 'react-toastify/dist/ReactToastify.css'; // Importing Toastify styles
import addCategoryApi from '../../apis/categories/addCategory.api';

type CategoryFormData = {
  category_name: string;
  url_slug: string;
  parent_categorie_id: number | null;
  status: string;
};


const AddNewCategory: React.FC = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    category_name: '',
    url_slug: '',
    parent_categorie_id: null,
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (name === 'category_name') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        url_slug: slugify(value),
      }));
    } else if (name === 'url_slug') {
      value = slugify(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
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
      const response = await addCategoryApi(formData);
      if (response) {
        toast.success('Category added successfully!');
        setFormData({ category_name: '', url_slug: '', parent_categorie_id: null, status: 'active' }); // Clear form after success
      } else {
        toast.error(response.message || 'Error adding category.');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="border input-bordered p-6 rounded-lg  max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input
            type="text"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">URL Slug</label>
          <input
            type="text"
            name="url_slug"
            value={formData.url_slug}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Generated automatically or enter manually"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Parent Category ID</label>
          <input
            type="number"
            name="parent_categorie_id"
            value={formData.parent_categorie_id ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, parent_categorie_id: Number(e.target.value) || null }))}
            className="input input-bordered w-full"
            placeholder="Enter parent category ID or leave blank for root category"
          />
        </div>
        <div className="mb-4">
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
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewCategory;
