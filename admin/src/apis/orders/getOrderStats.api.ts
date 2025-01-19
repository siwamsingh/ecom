import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type OrdersStatsResponse = {
  day: number;
  placed_orders: number;
  paid_orders: number;
  orders_processed: number;
}[];

const getOrdersStats = async (): Promise<OrdersStatsResponse> => {
  const response = await axios.post(`${serverUrl}/orders/get-orders-stats`,{} ,{ withCredentials: true });
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
};

const getOrdersStatsApi = async (): Promise<OrdersStatsResponse> => {
  try {
    return await getOrdersStats();
  } catch (error: any) {
    console.error("Error during getting order statistics:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await getOrdersStats();
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default getOrdersStatsApi;

