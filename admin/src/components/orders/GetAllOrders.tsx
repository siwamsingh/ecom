import React, { useEffect, useState } from 'react';
import getAllOrdersNoPaginationApi from '../../apis/orders/getAllOrdersNoPagination.api';

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

const GetAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Default to today
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const startTime = new Date(filterDate).toISOString().replace("T00:00:00.000Z", "T00:00:00");
      const endTime = new Date(filterDate).toISOString().replace("T00:00:00.000Z", "T23:59:59");

      const response: any = await getAllOrdersNoPaginationApi({
        start_time: startTime,
        end_time: endTime,
      });

      console.log(response);
      
      setOrders(response.orders);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (orderId: number) => {
    setExpandedRows(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const isRowExpanded = (orderId: number) => expandedRows.includes(orderId);

  const parseAddress = (address: string) => {
    try {
      const parsed = JSON.parse(address);
      return (
        <ul className="space-y-1 text-sm">
          {Object.entries(parsed).map(([key, value]: any) => (
            <li key={key}>
              <span className="font-semibold capitalize">{key.replace(/_/g, " ")}:</span> {value}
            </li>
          ))}
        </ul>
      );
    } catch {
      return <p className="text-sm">{address}</p>;
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-sm text-gray-200">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-xs text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 mt-10 mb-96">
      <div className='flex justify-between'>
      <h1 className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-200">Orders</h1>

      {/* Date Filter */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="date"
          id="filterDate"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 text-sm sm:text-base  rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        />
        <button onClick={fetchOrders} className='text-xs sm:text-sm text-blue-400 font-semibold'>

        Apply Filter
        </button>
      </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200">Order ID</th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200">User ID</th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200">Total Amount</th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200">Status</th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200">Payment Status</th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr
                  onClick={() => toggleRow(order._id)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                >
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">{order._id}</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">{order.user_id}</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">₹{order.total_amount}</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      order.status === 'placed' ? 'border-blue-500 text-blue-700 dark:text-blue-300' :
                      order.status === 'processing' ? 'border-yellow-500 text-yellow-700 dark:text-yellow-300' :
                      order.status === 'cancelled' ? 'border-red-500 text-red-700 dark:text-red-300' :
                      'border-yellow-300 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800 dark:text-green-300 dark:bg-green-900' :
                      'bg-red-100 text-red-800 dark:text-red-300 dark:bg-red-900'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
                {isRowExpanded(order._id) && (
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td colSpan={6} className="border border-gray-300 dark:border-gray-700 p-3">
                      <div className="space-y-4">
                        {/* Order Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Order Details</h3>
                            <p>Order Number: {order.order_number}</p>
                            <p>Total Amount: ₹{order.total_amount}</p>
                            <p>Discount: ₹{order.discount_amount}</p>
                            <p>Shipping: ₹{order.shipping_amount}</p>
                            <p>Net Amount: ₹{order.net_amount}</p>
                            <p>Payment Type: {order.payment_type || 'N/A'}</p>
                            <p>Transaction ID: {order.payment_transaction_id || 'N/A'}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Shipping Information</h3>
                            {parseAddress(order.shipping_address)}
                            <p>Parcel ID: {order.parcel_id || 'N/A'}</p>
                            <p>Last Updated: {new Date(order.order_updated_at).toLocaleString()}</p>
                          </div>
                        </div>
                        {/* Order Items */}
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Order Items</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {order.order_items.map((item) => (
                              <div key={item.order_item_id} className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium text-sm text-gray-700 dark:text-gray-200">{item.product_details.product_name}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      Product Id: {item.product_details.product_id} 
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      Quantity: {item.quantity} × ₹{item.price}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      slug: {item.product_details.url_slug} 
                                    </p>
                                  </div>
                                  <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">₹{item.total_amount}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllOrders;
