import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_URL;
import refreshApi from '../auth/refresh-token.api';

type OrderItem = {
  order_item_id?: number;
  product_id?: number;
  quantity?: number;
  price?: number;
  total_amount?: number;
  shipping_address_id?: number;
  created_at?: string;
  product_details?: {
    product_id?: number;
    product_name?: string;
    url_slug?: string;
    categorie_id?: number;
    description?: string;
    price?: number;
    stock_quantity?: number;
    status?: string;
    image_url?: string;
  };
};

type Order = {
  _id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  discount_amount: number;
  gross_amount: number;
  shipping_amount: number;
  net_amount: number;
  status: string;
  payment_status: string;
  payment_type: string;
  payment_transaction_id: string;
  created_at: string;
  updated_at: string;
  parcel_id: string;
  shipping_address: string;
  order_items: OrderItem[];
};

type OrdersResponse = {
  page: number;
  limit: number;
  maxPages: number;
  totalCount: number;
  orders: Order[];
};

type OrderParams = {
  payment_status?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
  page?: number;
  limit?: number;
};

const getAllOrders = async (params: OrderParams): Promise<OrdersResponse> => {
  const response = await axios.post(`${serverUrl}/orders/get-all-orders`, params, { withCredentials: true });
  const { data, statusCode, message, success } = response.data;

  if (success && statusCode === 200) {
    console.log(message);
    return data;
  } else {
    throw new Error(message || "An unexpected error occurred.");
  }
};

const getAllOrdersApi = async (params: OrderParams): Promise<OrdersResponse> => {
  try {
    return await getAllOrders(params);
  } catch (error: any) {
    console.error("Error during fetching orders:", error?.message);
    try {
      if (error?.status === 577) {
        await refreshApi();
        return await getAllOrders(params);
      } else {
        throw error;
      }
    } catch (err: any) {
      throw err;
    }
  }
};

export default getAllOrdersApi;
