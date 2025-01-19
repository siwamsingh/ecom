import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import getOrdersStatsApi from "../../apis/orders/getOrderStats.api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrdersStatsChart = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getOrdersStatsApi();

        // Map dates for X-axis
        const labels = stats.map((item: any) => {
          const today = new Date();
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() - (item.day-1));
          return targetDate.toLocaleDateString(); // Format as 'MM/DD/YYYY'
        });

        const placedOrders = stats.map((item) => item.placed_orders);
        const paidOrders = stats.map((item) => item.paid_orders);
        const ordersProcessed = stats.map((item) => item.orders_processed);

        setChartData({
          labels,
          datasets: [
            {
              label: "Placed Orders",
              data: placedOrders,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Paid Orders",
              data: paidOrders,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Processed Orders",
              data: ordersProcessed,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch data for the chart:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Order Statistics
      </h2>
      {chartData ? (
        <div className="overflow-x-auto w-full">
          <div className="min-w-[700px]">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Orders Statistics for the Last 10 Days",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Order Count",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading chart data...</p>
      )}
    </div>
  );
};

export default OrdersStatsChart;
