import axios from 'axios';

const serverUrl = import.meta.env.VITE_API_URL;


const logoutApi = async () => {
  try {
    const response = await axios.post(`${serverUrl}/users/logout`,{},{withCredentials: true});
    const {  statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      console.log(message);
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error: any) {
    console.error("Error during login:", error?.message);
    throw error;
  }
};

export default logoutApi
