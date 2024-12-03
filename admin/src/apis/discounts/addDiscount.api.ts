import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type Discount= {
    coupon_code: string;
    product_id: number;
    discount_value: number;
    start_date: string;
    end_date: string;
    status: string;
  }

const addDiscount =async (discountData:Discount)=>{
  const response = await axios.post(`${serverUrl}/discount/add-new-discount`,discountData,{withCredentials: true});
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
}


const addDiscountApi = async (discountData:Discount) => {
  try {
   return await addDiscount(discountData);
  } catch (error: any) {
    console.error("Error during adding discounts:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await addDiscount(discountData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default addDiscountApi
