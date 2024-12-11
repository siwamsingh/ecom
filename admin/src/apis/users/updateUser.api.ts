import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type UpdatedUserData = {
  user_id: number|null|undefined;
  user_status: string
  user_login_attempt: number
}

const updateUser = async (updatedUserData: UpdatedUserData) => {
  const response = await axios.post(`${serverUrl}/users/edit-user`, updatedUserData, { withCredentials: true });
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const updateUserApi = async (updatedUserData: UpdatedUserData) => {
  try {
    return await updateUser(updatedUserData);
  } catch (error: any) {
    console.error("Error during getting users:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await updateUser(updatedUserData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default updateUserApi
