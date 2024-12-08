import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type UserFilter = {
  page: number|null|undefined;
  role: string|null|undefined;
  status: string|null|undefined;
}

const getUsers = async (filterData: UserFilter) => {
  const response = await axios.post(`${serverUrl}/users/get-users`, filterData, { withCredentials: true });
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const getUsersApi = async (filterData: UserFilter) => {
  try {
    return await getUsers(filterData);
  } catch (error: any) {
    console.error("Error during getting users:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await getUsers(filterData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default getUsersApi
