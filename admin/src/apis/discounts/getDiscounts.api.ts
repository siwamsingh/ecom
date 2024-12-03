import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type DiscountFilter = {
  page: number
  limit: number
  status: string
  expired: boolean
}

const getAllDiscounts = async (filterData: DiscountFilter) => {
  const response = await axios.post(`${serverUrl}/discount/get-discounts`, filterData, { withCredentials: true });
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const getAllDiscountsApi = async (filterData: DiscountFilter) => {
  try {
    return await getAllDiscounts(filterData);
  } catch (error: any) {
    console.error("Error during getting all discounts:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await getAllDiscounts(filterData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default getAllDiscountsApi
