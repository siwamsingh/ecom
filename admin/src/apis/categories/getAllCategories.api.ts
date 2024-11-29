import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

const getAllCategories =async ()=>{
  const response = await axios.post(`${serverUrl}/category/get-categories`,{},{withCredentials: true});
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const getAllCategoriesApi = async () => {
  try {
   return await getAllCategories();
  } catch (error: any) {
    console.error("Error during getting all categories:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        await getAllCategories();
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default getAllCategoriesApi
