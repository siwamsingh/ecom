import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type UpdateDiscount= {
    _id: number;
    discount_value: number;
    start_date: string;
    end_date: string;
    status: string;
  }

const updateDiscount =async (UpdateDiscountData:UpdateDiscount)=>{
  const response = await axios.post(`${serverUrl}/discount/update-discount`,UpdateDiscountData,{withCredentials: true});
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const updateDiscountApi = async (updateDiscountData:UpdateDiscount) => {
  try {
   return await updateDiscount(updateDiscountData);
  } catch (error: any) {
    console.error("Error during updating UpdateDiscounts:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await updateDiscount(updateDiscountData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default updateDiscountApi
