import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;

const deleteCategoryApi = async (_id: number) => {
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
  } catch (error: any) {
    console.error("Error during deletion:", error?.message);
    throw error;
  }
};

export default deleteCategoryApi;
