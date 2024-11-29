import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

const deleteCategory =async (_id: number)=>{
  try {
    const response = await axios.post(
      `${serverUrl}/category/delete-category`,
      { _id },
      { withCredentials: true }
    );
    const { data, statusCode, message, success } = response.data;
  
    if (success && statusCode === 200) {
      console.log(message);
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error) {
    throw error
  }
}

const deleteCategoryApi = async (_id: number) => {
  try {
    return await deleteCategory(_id)
  } catch (error: any) {
    console.error("Error during deletion of category:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await deleteCategory(_id);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default deleteCategoryApi;
