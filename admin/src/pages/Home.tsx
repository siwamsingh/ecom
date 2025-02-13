import OrdersStatsChart from "../components/orders/OrderStats";
import GetAllOrders from "../components/orders/GetAllOrders";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="w-full sm:w-11/12 mx-auto ">
        {/* Gradient Buttons */}
        <div className="grid grid-cols-1 mx-4 sm:p-0 sm:grid-cols-3 gap-4 my-8 max-w-3xl sm:mx-auto">
          <button
            onClick={() => navigate("/manage-store")}
            className="w-full py-4 text-lg font-semibold text-white rounded-2xl shadow-lg bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition duration-300"
          >
            Manage Account
          </button>
          <button
            onClick={() => navigate("/order/download-slip")}
            className="w-full py-4 text-lg font-semibold text-white rounded-2xl shadow-lg bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 transition duration-300"
          >
            Download Order Slip
          </button>
          <button 
          onClick={() => navigate("/order/manage-order")}
          className="w-full py-4 text-lg font-semibold text-white rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition duration-300">
            Manage Orders
          </button>
        </div>

        {/* Stats and Orders */}
        <OrdersStatsChart />
        <GetAllOrders />
      </div>
    </div>
  );
}

export default Home;
