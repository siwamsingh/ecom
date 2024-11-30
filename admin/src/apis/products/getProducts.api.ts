import axios from 'axios';

const serverUrl = import.meta.env.VITE_API_URL;

export type GetProductsParams = {
  page?: number;
  limit?: number;
  category?: number;
  status?: string;
  search?: string;
};

export const getProductsApi = async (params: GetProductsParams) => {
  try {
    const response = await axios.post(`${serverUrl}/product/get-product`, params, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching products:', error?.message);
    throw error;
  }
};
