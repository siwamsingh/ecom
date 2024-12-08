import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type UserData = {
  user_id: number|null|undefined;
  user_phone_number: string|null|undefined;
}

const getUser = async (userData: UserData) => {
  const response = await axios.post(`${serverUrl}/users/get-user`, userData, { withCredentials: true });
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const getUserApi = async (userData: UserData) => {
  try {
    return await getUser(userData);
  } catch (error: any) {
    console.error("Error during getting users:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await getUser(userData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default getUserApi
