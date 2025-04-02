// components/order/types.ts

export interface Product {
  _id: string;
  product_name: string;
  url_slug: string;
  categorie_id: number | null;
  description: string;
  price: number;
  stock_quantity: number;
  status: string;
  image_url: string;
  }
  
  export interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
    total_amount: number;
  }
  
  export interface Coupon {
    coupon_code: string;
    product_id: number;
    discount_value: string;
  }
  
  export interface Address {
    _id: number;
    area: string;
    town_or_city: string;
    pincode: string;
    landmark: string;
    state: string;
    specific_location: string;
    country: string;
    is_default: boolean;
  }