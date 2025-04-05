"use client";

import {  useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TiArrowRightThick } from "react-icons/ti";
import { PiPackageDuotone } from "react-icons/pi";
import { FaProductHunt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "@/app/MainLayout";
import { Info } from "lucide-react";
import Image from "next/image";

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

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  let once = true

  useEffect(() => {
    if(!once) return;
    const fetchUserOrders = async () => {
        try {

          const response = await axios.post("/api/order/fetch-history", {
            userId: null,
          });
      
          if (!response.data.success) {
            toast.error("Failed to load your order history");
            return;
          }
          
          const now = new Date();
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
      
          // Filter orders placed in the last 30 days
          const recentOrders = response.data.data.filter((order: Order) => {
            const orderDate = new Date(order.created_at);
            return orderDate >= thirtyDaysAgo;
          });

          console.log(recentOrders);
          
      
          setOrders(recentOrders);
        } catch (err: any) {
          if (err?.response?.status === 477) {
            toast.error("Login to continue.");
            setTimeout(() => router.push("/auth/login"), 3000);
            return;
          }
      
          if (err?.response?.status === 577) {
            toast.error("Session Expired. Login to continue.");
            setTimeout(() => router.push("/auth/login"), 3000);
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
      <h1 className="text-xl font-bold mb-4">My Orders: </h1>
      <div className="bg-yellow-50 rounded-xl p-4 flex items-center mb-6">
                <Info className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
                <p className="text-sm text-yellow-900">
                  {" "}
                  This is a summary of all your orders <strong>placed in last 30 days</strong>, including both{" "}
                  <strong>paid and unpaid</strong> ones.{" "}<br/> In case payment is done but it still shows unpaid{" "}
          <a href="/contact" className="text-blue-600 font-medium hover:underline">
            call us
          </a>.
                </p>
              </div>
      {!loading  ? (
  orders && orders.length > 0 ? (
    orders.map((order, index) => (
      <div
        key={index}
        className="rounded-lg p-4 mb-6 shadow-md bg-slate-50 text-black"
      >
        <div className="mb-4">
          <span className="text-lg font-bold mb-4 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <PiPackageDuotone size={30} /> Order Id: {order._id}
            </span>
            <span
              className={`px-3 py-1 rounded-md text-white ${
                order.payment_status === "paid" ? "bg-green-500" : "bg-yellow-500"
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
              timeZone: "Asia/Kolkata",
            })}
          </p>
          <p className="text-sm font-semibold flex items-center gap-2 mb-2">
            RP Order Id <TiArrowRightThick /> {order.order_number}
          </p>
          <p className="text-sm font-semibold flex items-center gap-2 mb-2">
            Transaction Id <TiArrowRightThick /> {order.payment_transaction_id}
          </p>
          <p className="text-sm font-semibold flex items-center gap-2">
            Amount Paid <TiArrowRightThick /> ₹{order.net_amount}
          </p>
        </div>

        <p className={`text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
          Order Status <TiArrowRightThick /> {order.status}
        </p>

        <div className="mb-4">
          <p className="text-sm font-semibold flex items-center gap-2">
            Shipping Address <TiArrowRightThick />
            {renderShippingAddress(order.shipping_address)}
          </p>
        </div>
        <div className="mb-4">
          {order.parcel_id ? <p className="text-sm font-semibold flex items-center gap-2">
            Parcel Id <TiArrowRightThick /> 
            {order.parcel_id}
          </p> : 
           null}
        </div>

        <h2 className="text-md font-bold mb-2">Order Items</h2>
        {order.order_items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between border-t py-2">
            <div className="flex items-start">
              <Image
                src={item.product_details.image_url}
                alt={item.product_details.product_name}
                loading="lazy"
                width={100}
                height={100}
                className="w-16 h-16 object-contain rounded-md mr-4"
              />
              <div>
                <h3 className="text-sm sm:text-lg font-semibold flex items-center gap-2">
                  <FaProductHunt /> {item.product_details.product_name}
                </h3>
                <p className="text-sm">Price: ₹{item.price}</p>
              </div>
            </div>
            <div className="text-lg font-bold pr-4">x{item.quantity}</div>
          </div>
        ))}
      </div>
    ))
  ) : (
    <div className="">
    <p className="text-center p-4">No new orders in last 30 days.</p>
    <p className="text-center p-4">Click to see <a href="/order/history" className="text-blue-600 underline">Order History</a></p>
  </div>
  )
) : <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div> }

    </div>
    </MainLayout>
  );
};

export default MyOrders;
