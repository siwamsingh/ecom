import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type catData = {
  category_name: string;
  url_slug: string;
  parent_categorie_id: number | null;
  status: string;
}

const addCategory = async (categoryData: catData) => {
  try {
    const response = await axios.post(`${serverUrl}/category/add-new-category`, categoryData, { withCredentials: true });
    const { data, statusCode, message, success } = response.data;
    if (success && statusCode === 200) {
      console.log(message);
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error) {
    throw error;
  }
}
const addCategoryApi = async (categoryData: catData) => {
  try {
    return await addCategory(categoryData)

  } catch (error: any) {
    console.error("Error during adding category:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        await addCategory(categoryData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default addCategoryApi
