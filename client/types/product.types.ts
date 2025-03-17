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
  };
  