import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getOrderOfUserApi from "../../apis/orders/getOrderOfUser.api";

import { TiArrowRightThick } from "react-icons/ti";
import { PiPackageDuotone } from "react-icons/pi";
import { FaProductHunt } from "react-icons/fa";



interface Product {
  product_id: number;
  product_name: string;
  url_slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  status: string;
  image_url: string;
}

interface OrderItem {
  order_item_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total_amount: number;
  shipping_address_id: number | null;
  created_at: string;
  product_details: Product;
}

interface Order {
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
  payment_type: string | null;
  payment_transaction_id: string | null;
  shipping_address: string;
  created_at: string;
  order_updated_at: string;
  parcel_id: string | null;
  order_items: OrderItem[];
}

type Address = {
  _id: number;
  specific_location: string;
  area: string;
  landmark: string;
  pincode: string;
  town_or_city: string;
  state: string;
  country: string;
};

const renderShippingAddress = (input: string) => {
  let shippingAdd: Address | null = null;

  try {
    // Parse the JSON string if it's not "UNKNOWN"
    if (input !== "UNKNOWN") {
      shippingAdd = JSON.parse(input);
    }
  } catch (error) {
    console.error("Invalid JSON input:", error);
  }

  if (!shippingAdd) {
    // If the input is "UNKNOWN" or invalid JSON
    return (
      <div className="flex max-w-lg">
        Address information is not available.
      </div>
    );
  }

  // Render the component with the address data
  return (
    <div className="flex max-w-lg">
      {shippingAdd?.specific_location}, {shippingAdd?.area}, {shippingAdd?.landmark}, {shippingAdd?.pincode}, {shippingAdd?.town_or_city}, {shippingAdd?.state}, {shippingAdd?.country}
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "cancelled":
      return "text-red-500"; // Red for cancelled
    case "placed":
      return "text-yellow-500"; // Yellow for placed
    case "delivered":
      return "text-green-500"; // Green for delivered
    default:
      return "text-blue-500"; // Blue for other statuses
  }
};


const UserHistory = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!userId) return;
      try {
        const response = await getOrderOfUserApi({ user_id: userId });
        console.log(response);
        
        setOrders(response);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Order History: {userId}</h1>
      {!loading ? (
        orders.map((order, index) => (
          <div
            key={index}
            className=" rounded-lg p-4 mb-6 shadow-md bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <div className="mb-4">
            
              <p className="text:base sm:text-lg font-bold text-black dark:text-white mb-4 flex justify-between items-center">
                <span className="flex items-center gap-2"><PiPackageDuotone size={30}/>Order Id: {order._id}</span>
                <span
                  className={`${
                    order.payment_status === "paid"
                      ? "badge badge-success"
                      : "badge badge-warning"
                  }`}
                >
                  {order.payment_status}
                </span>
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-4">
                Date
                <TiArrowRightThick />{order.created_at}
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
                RP Order Id
                <TiArrowRightThick />{order.order_number}
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-4">
                Transaction Id
                <TiArrowRightThick />{order.payment_transaction_id}
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
                Total Amount
                <TiArrowRightThick />₹{order.total_amount}
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
                Discount
                <TiArrowRightThick />
                -₹{order.discount_amount}
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
                Gross Amount
                <TiArrowRightThick />₹{order.gross_amount}
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2 pb-2 border-b dark:border-gray-600 border-gray-800">
                Shipping Amount
                <TiArrowRightThick />₹{order.shipping_amount}
              </p>
              <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
                Net Amount
                <TiArrowRightThick />₹{order.net_amount}
              </p>
            </div>
            <div className="mb-4">
            <p className={`text-sm sm:text-lg font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
        Order Status
        <TiArrowRightThick />
        {order.status}
      </p>
            </div>

            <div className="mb-4">
              <p className="text-sm sm:text-lg font-semibold flex items-center gap-2">
                Shipping Address
                <TiArrowRightThick />
                {renderShippingAddress(order.shipping_address)}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm sm:text-lg font-semibold flex items-center gap-2">
                Parcel Id
                <TiArrowRightThick />
                {order?.parcel_id}
              </p>
            </div>

            <div>
              <h2 className="text-md font-bold mb-2">Order Items</h2>
              {order.order_items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-t last:border-b"
                >
                  <div className="flex items-start p-2">
                  <img
                    src={item.product_details.image_url}
                    alt={item.product_details.product_name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold flex items-center gap-2" >
                    {item.product_details.product_id}<FaProductHunt/>{item.product_details.product_name}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-400">
                      {item.product_details.description}
                    </p>
                    <p className="text-sm">
                      Price: ₹{item.price} 
                    </p>
                  </div>
                  </div>
                <div className="text-lg sm:text-2xl font-bold font-mono pr-4">x{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div
          role="status"
          className="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
