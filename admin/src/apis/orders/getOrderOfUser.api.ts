import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type UserId = {
  user_id: string
}

const getOrderOfUser = async (userId: UserId) => {
  const response = await axios.post(`${serverUrl}/orders/get-user-orders`, userId, { withCredentials: true });
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const getOrderOfUserApi = async (userId: UserId) => {
  try {
    return await getOrderOfUser(userId);
  } catch (error: any) {
    console.error("Error during getting users:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await getOrderOfUser(userId);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default getOrderOfUserApi
