import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type UpdateCategoryProps = {
  _id: number | undefined;
  category_name: string | undefined;
  url_slug: string | undefined;
  status: string | undefined;
};

const updateCategory = async (updateData: UpdateCategoryProps) => {
  try {
    const response = await axios.post(`${serverUrl}/category/update-categories`, updateData, { withCredentials: true });
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


const updateCategoryApi = async (updateData: UpdateCategoryProps) => {
  try {
    return await updateCategory(updateData)
  } catch (error: any) {
    console.error("Error during updating category:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await updateCategory(updateData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default updateCategoryApi
