"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TiArrowRightThick } from "react-icons/ti";
import { PiPackageDuotone } from "react-icons/pi";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "@/app/MainLayout";
import Image from "next/image";
import Link from "next/link";

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
  } catch {
    toast.error("Unknown address format");
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
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
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

        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        // Filter orders placed in the last 30 days
        const recentOrders = response.data.data.filter((order: Order) => {
          const orderDate = new Date(order.created_at);
          return orderDate >= thirtyDaysAgo;
        });

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

        toast.error("Failed to load your order history");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
    once = false;
  }, []);

  const toggleOrder = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto min-h-[70vh] p-4 bg-white text-black">
        <h1 className="text-xl font-bold mb-4">My Orders: </h1>
        <div className="bg-yellow-50 rounded-xl p-4 flex items-center mb-6">
          <Info className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-yellow-900">
            {" "}
            This is a summary of all your orders{" "}
            <strong>placed in last 30 days</strong>, including both{" "}
            <strong>paid and unpaid</strong> ones. <br /> In case payment is
            done but it still shows unpaid{" "}
            <a
              href="/contact"
              className="text-blue-600 font-medium hover:underline"
            >
              call us
            </a>
            .
          </p>
        </div>
        {!loading ? (
          orders && orders.length > 0 ? (
            orders.map((order, index) => (
              <div
                key={order._id}
                className="rounded-lg mb-4 sm:mb-6 shadow-md text-black overflow-hidden"
              >
                {/* Order Header - Always Visible */}
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleOrder(order._id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <PiPackageDuotone size={24} />
                      <span className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-sm font-bold rounded-md  ${
                          order.payment_status === "paid"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                      {expandedOrder === order._id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview - Always Visible */}
                  <div className="mt-3 flex flex-wrap gap-2  border-l border-slate-400 ml-2 pl-2  ">
                    {order.order_items.map((item, idx) => (
                      <div
                        key={"preview"+String(order._id)+String(item.order_item_id)}
                        className="flex items-center bg-slate-50 gap-2 w-full sm:w-fit p-2 rounded-md"
                      >
                        <Image
                          src={item.product_details.image_url}
                          alt={item.product_details.product_name}
                          loading="lazy"
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain rounded-md"
                        />
                        <div className="text-sm">
                          <div className="font-medium truncate max-w-[120px]">
                            {item.product_details.product_name}
                          </div>
                          <div className="text-gray-500">x{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-end">
                    {order.parcel_id && (
                      <Link
                        href={
                          order.parcel_id
                            ? `/track-order/${order.parcel_id}`
                            : "#"
                        }
                        className={`px-3 py-1 m-4 text-white font-medium rounded-lg transition-colors duration-200 ${
                          order.parcel_id
                            ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        onClick={(e) => !order.parcel_id && e.preventDefault()}
                      >
                        Track Order
                      </Link>
                    )}
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div className="px-4 pb-4 pt-1 bg-sky-50 border-t border-gray-200">
                    <div className="mb-4 mt-2">
                      <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                        Order ID <TiArrowRightThick /> {order._id}
                      </p>
                      <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                        RP Order Id <TiArrowRightThick /> {order.order_number}
                      </p>
                      <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                        Transaction Id <TiArrowRightThick />{" "}
                        {order.payment_transaction_id}
                      </p>
                      <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                        Amount Paid <TiArrowRightThick /> ₹{order.net_amount}
                      </p>
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
                      <p
                        className={`text-sm font-semibold flex items-center gap-2 mb-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        Order Status <TiArrowRightThick /> {order.status}
                      </p>

                      <div className="mb-2">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          Shipping Address <TiArrowRightThick />
                          {renderShippingAddress(order.shipping_address)}
                        </p>
                      </div>

                      {order.parcel_id && (
                        <div className="mb-2 flex ">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            Parcel Id <TiArrowRightThick /> {order.parcel_id}
                          </p>
                        </div>
                      )}
                    </div>

                    <h2 className="text-md font-bold mb-3">
                      Order Items Detail
                    </h2>
                    {order.order_items.map((item, idx) => (
                      <Link
                      key={"order image"+String(order._id)+item.product_details.product_id}
                        href={`/product?product-id=${item.product_details.product_id}&product-name=${item.product_details.url_slug}`}
                      >
                        <div
                         
                          className="flex items-center justify-between border-t py-3"
                        >
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
                                {item.product_details.product_name}
                              </h3>
                              <p className="text-sm">Price: ₹{item.price}</p>
                            </div>
                          </div>
                          <div className="text-lg font-bold pr-4">
                            x{item.quantity}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="">
              <p className="text-center p-4">No new orders in last 30 days.</p>
              <p className="text-center p-4">
                Click to see{" "}
                <a href="/order/history" className="text-blue-600 underline">
                  Order History
                </a>
              </p>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyOrders;
