import React, { useState, useRef, useEffect } from "react";
import updateOrderApi from "../apis/orders/updateOrder.api";
import * as XLSX from "xlsx";

interface OrderData {
  _id: number;
  order_number: string;
  parcel_id: string;
  status: string;
  weight: number;
  delivery_details: {
    username: string;
    phone_number: string;
    pincode: string;
    post_office: string;
    district: string;
  };
}

const STORAGE_KEY = "manageOrdersData";

const ManageOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [parcelId, setParcelId] = useState("");
  const [weight, setWeight] = useState<number>(0);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const orderInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedOrders = localStorage.getItem(STORAGE_KEY);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Update localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !parcelId) return;

    setLoading(true);
    try {
      console.log(orderId, parcelId);

      const data = await updateOrderApi({
        _id: parseInt(orderId),
        parcel_id: parcelId,
        status: "shipping",
      });

      // Remove previous occurrence of the same order if exists
      const filteredOrders = orders.filter((order) => order._id !== data._id);

      // Add new order at the beginning of the array with weight
      setOrders([{ ...data, weight }, ...filteredOrders]);

      // Reset form but keep the weight
      setOrderId("");
      setParcelId("");
      orderInputRef.current?.focus();
    } catch (error: any) {
      console.error("Error updating order:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrders(orders.filter((order) => order._id !== orderId));
  };

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleExportExcel = () => {
    try {
      // Prepare data for export
      const exportData = orders.map((order) => ({
        "Order ID": order._id,
        "Parcel ID": order.parcel_id,
        "Customer Name": order.delivery_details.username,
        Phone: order.delivery_details.phone_number,
        Pincode: order.delivery_details.pincode,
        "Post Office": order.delivery_details.post_office,
        "District/City": order.delivery_details.district,
        "Weight (g)": order.weight,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      // Generate Excel file
      XLSX.writeFile(
        wb,
        `Orders_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <div className=" min-h-screen bg-base-100">
      <div className="card bg-base-200 shadow-xl">
        <div className="p-4 sm:card-body">
          <h2 className="card-title text-lg sm:text-2xl font-bold mb-2 sm:mb-2">
            Manage Orders
          </h2>
          <div className="flex flex-wrap gap-4 items-end justify-between">
            <div className="flex items-end gap-4">
            <div className="form-control max-w-40">
              <label className="label">
                <span className="label-text text-xs sm:text-base">
                  Weight (g)
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="input input-bordered w-full input-sm sm:input-md"
              />
            </div>
            <button
              type="button"
              onClick={handleExportExcel}
              className="btn btn-success btn-sm sm:btn-md text-xs sm:text-base"
              disabled={orders.length === 0}
            >
              Download Excel
            </button>
            </div>
            <button
                  type="button"
                  onClick={handleClearOrders}
                  className="btn btn-warning btn-sm sm:btn-md text-xs sm:text-base"
                  disabled={orders.length === 0}
                >
                  Clear All
                </button>
          </div>
          {/* Form */}
          <form
            onSubmit={handleOrderSubmit}
            className="flex items-end justify-between space-y-4 mb-2"
          >
            <div className="sm:flex w-full  space-y-2 sm:space-y-0 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs sm:text-base">
                    Order ID
                  </span>
                </label>
                <input
                  type="text"
                  ref={orderInputRef}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Scan Order ID"
                  className="input input-bordered  w-full input-sm sm:input-md"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs sm:text-base">
                    Parcel ID
                  </span>
                </label>
                <input
                  type="text"
                  value={parcelId}
                  onChange={(e) => setParcelId(e.target.value)}
                  placeholder="Scan Parcel ID"
                  className="input input-bordered w-full input-sm sm:input-md"
                />
              </div>

              <div className="flex justify-end items-end gap-4">

                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}  btn-sm sm:btn-md text-xs sm:text-base`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit"}
                </button>
              </div>
            </div>
          </form>

          <div className="py-1 sm:py-2 backdrop-brightness-50 flex items-center justify-center text-sm sm:text-base">
            Count : {orders.length}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Parcel ID</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Pincode</th>
                  <th>Post Office</th>
                  <th>District/City</th>
                  <th>Weight (g)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="hover">
                    <td>{order._id}</td>
                    <td>{order.parcel_id}</td>
                    <td>{order.delivery_details.username}</td>
                    <td>{order.delivery_details.phone_number}</td>
                    <td>{order.delivery_details.pincode}</td>
                    <td>{order.delivery_details.post_office}</td>
                    <td>{order.delivery_details.district}</td>
                    <td>{order.weight}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="btn btn-error btn-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-8 text-base-content/60">
              No orders scanned yet. Scan order and parcel IDs to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;
