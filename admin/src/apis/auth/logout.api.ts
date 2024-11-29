import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from './refresh-token.api';


const logout = async () => {
  try {
    const response = await axios.post(`${serverUrl}/users/logout`, {}, { withCredentials: true });
    const { statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      console.log(message);
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error) {
    throw error;
  }
}

const logoutApi = async () => {
  try {
    await logout();
  } catch (error: any) {
    console.error("Error during login:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        await logout();
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }


  }
};

export default logoutApi
