import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

// Define the type for the update order function
interface UpdateOrderProps {
  _id: number | undefined;
  status?: string;
  parcel_id?: string | null;
}

const updateOrder = async (updateData: UpdateOrderProps) => {
  try {
    const response = await axios.post(`${serverUrl}/orders/update-order`, updateData, { withCredentials: true });
    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      console.log(message);
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }

  } catch (error) {
    throw error;
  }
};

const updateOrderApi = async (updateData: UpdateOrderProps) => {
  try {
    return await updateOrder(updateData);
  } catch (error: any) {
    console.error("Error during updating order:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await updateOrder(updateData);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default updateOrderApi;
