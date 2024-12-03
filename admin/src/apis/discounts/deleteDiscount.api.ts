import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

const deleteDiscount =async (discount_id: number)=>{
  try {
    const response = await axios.post(
      `${serverUrl}/discount/delete-discount`,
      { discount_id },
      { withCredentials: true }
    );
    const { data, statusCode, message, success } = response.data;
  
    if (success && statusCode === 200) {
      console.log(message);
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error) {
    throw error
  }
}

const deleteDiscountApi = async (discount_id: number) => {
  try {
    return await deleteDiscount(discount_id)
  } catch (error: any) {
    console.error("Error during deletion of dicount:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await deleteDiscount(discount_id);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default deleteDiscountApi;
