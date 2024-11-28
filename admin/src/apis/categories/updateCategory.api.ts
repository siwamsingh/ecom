import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;

type UpdateCategoryProps = {
  _id: number|undefined;
  category_name: string|undefined;
  url_slug: string|undefined;
  status: string|undefined;
};

const updateCategoryApi = async (updateData: UpdateCategoryProps) => {
  try {
    const response = await axios.post(`${serverUrl}/category/update-categories`,updateData,{withCredentials: true});
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

export default updateCategoryApi
