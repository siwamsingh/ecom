import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;


const addCategoryApi = async () => {
  try {
    const response = await axios.post(`${serverUrl}/category/add-new-category`,{},{withCredentials: true});
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
