"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TiArrowRightThick } from "react-icons/ti";
import { PiPackageDuotone } from "react-icons/pi";
import { FaProductHunt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "@/app/MainLayout";
import { Info } from "lucide-react";

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
    if (input !== "UNKNOWN") {
      shippingAdd = JSON.parse(input);
    }
  } catch (error) {
    console.log("Invalid JSON input:", error);
  }

  if (!shippingAdd) {
    return (
      <span className="flex max-w-lg text-gray-600">
        Address information is not available.
      </span>
    );
  }

  return (
    <span className="flex max-w-lg text-gray-600">
      {shippingAdd?.specific_location}, {shippingAdd?.area},{" "}
      {shippingAdd?.landmark}, {shippingAdd?.pincode},{" "}
      {shippingAdd?.town_or_city}, {shippingAdd?.state}, {shippingAdd?.country}
    </span>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "cancelled":
      return "text-red-500";
    case "placed":
      return "text-yellow-500";
    case "delivered":
      return "text-green-500";
    default:
      return "text-blue-500";
  }
};

const UserHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  let once = true;

  useEffect(() => {
    if (!once) return;
    const fetchUserOrders = async () => {
      try {
        const response = await axios.post("/api/order/fetch-history", {
          userId: null,
        });

        if (!response.data.success) {
          toast.error("Failed to load your order history");
          return;
        }

        setOrders(response.data.data);
      } catch (err: any) {
        if (err?.response?.status === 477) {
          toast.error("Login to continue.");
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        if (err?.response?.status === 577) {
          toast.error("Session Expired. Login to continue.");
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
          return;
        }

        console.error("Failed to fetch order history", err);
        toast.error("Failed to load your order history");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
    once = false;
  }, []);

  return (
    <MainLayout>
      <div className="max-w-screen-lg mx-auto min-h-[70vh] p-4 bg-white text-black">
        <h1 className="text-xl font-bold mb-4">Order History: </h1>
        <div className="bg-yellow-50 rounded-xl p-4 flex items-center mb-6">
          <Info className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-yellow-900">
            {" "}
            This is a summary of all your orders, including both{" "}
            <strong>paid and unpaid</strong> ones.{" "} <br/>In case payment is done but it still shows unpaid {" "}
          <a href="/contact" className="text-blue-600 font-medium hover:underline">
            call us
          </a>.
          </p>
        </div>
        {!loading ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="rounded-lg p-4 mb-6 shadow-md bg-gray-100 text-black"
            >
              <div className="mb-4">
                <span className="text-lg font-bold mb-4 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <PiPackageDuotone size={30} /> Order Id: {order._id}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-md text-white ${
                      order.payment_status === "paid"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </span>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  Date <TiArrowRightThick />{" "}
                  {new Date(order.created_at).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  RP Order Id <TiArrowRightThick /> {order.order_number}
                </p>
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  Transaction Id <TiArrowRightThick />{" "}
                  {order.payment_transaction_id}
                </p>
                <p className="text-sm font-semibold flex items-center gap-2">
                  Total Amount <TiArrowRightThick /> ₹{order.total_amount}
                </p>
              </div>

              <p
                className={`text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                  order.status
                )}`}
              >
                Order Status <TiArrowRightThick /> {order.status}
              </p>

              <div className="mb-4">
                <p className="text-sm font-semibold flex items-center gap-2">
                  Shipping Address <TiArrowRightThick />
                  {renderShippingAddress(order.shipping_address)}
                </p>
              </div>

              <h2 className="text-md font-bold mb-2">Order Items</h2>
              {order.order_items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-t py-2"
                >
                  <div className="flex items-start">
                    <img
                      src={item.product_details.image_url}
                      alt={item.product_details.product_name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FaProductHunt /> {item.product_details.product_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product_details.description}
                      </p>
                      <p className="text-sm">Price: ₹{item.price}</p>
                    </div>
                  </div>
                  <div className="text-lg font-bold pr-4">x{item.quantity}</div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="p-4 border border-gray-200 rounded shadow animate-pulse bg-gray-200 text-black">
            <p className="h-6 w-32 bg-gray-300 rounded mb-2"></p>
            <p className="h-4 w-48 bg-gray-300 rounded"></p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserHistory;
