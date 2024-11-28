import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;

type catData = {
  category_name: string;
  url_slug: string;
  parent_categorie_id: number|null;
  status: string;
}
const addCategoryApi = async (categoryData: catData) => {
  try {
    const response = await axios.post(`${serverUrl}/category/add-new-category`,categoryData,{withCredentials: true});
    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      console.log(message);
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error: any) {
    console.error("Error during login:", error?.message);
    throw error;
  }
};

export default addCategoryApi
