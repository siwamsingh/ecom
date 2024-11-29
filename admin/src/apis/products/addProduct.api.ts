// src/api/addProductApi.ts
import axios from 'axios';

const serverUrl = import.meta.env.VITE_API_URL;

type ProductData = {
  product_name: string;
  url_slug: string;
  categorie_id: number | null;
  description: string;
  price: number;
  stock_quantity: number;
  status: string;
  product_image: File;
};

const addProductApi = async (productData: ProductData) => {
  const formData = new FormData();
  
  formData.append('product_name', productData.product_name);
  formData.append('url_slug', productData.url_slug);
  formData.append('categorie_id', productData.categorie_id?.toString() || '');
  formData.append('description', productData.description);
  formData.append('price', productData.price.toString());
  formData.append('stock_quantity', productData.stock_quantity.toString());
  formData.append('status', productData.status);
  formData.append('product_image', productData.product_image);

  try {
    const response = await axios.post(`${serverUrl}/product/add-new`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      console.log(message);
      return data;
    } else {
      throw new Error(message || 'An unexpected error occurred.');
    }
  } catch (error: any) {
    console.error('Error during product addition:', error?.message);
    throw error;
  }
};

export default addProductApi;
