import  { useEffect, useState } from "react";
import { Font } from '@react-pdf/renderer';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import getAllOrdersNoPaginationApi from "../apis/orders/getAllOrdersNoPagination.api";
import getUserApi from "../apis/users/getUser.api";
import * as bwipjs from 'bwip-js';
import { toast } from "react-toastify";

// Types from your existing component
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

interface OrderWithUser extends Order {
  userDetails?: any;
}

Font.register({
  family: 'NotoSans',
  src: 'https://fonts.gstatic.com/s/notosans/v21/o-0IIpQlx3QUlC5A4PNb4j5Ba_2c7A.ttf', 
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'NotoSans',
  },
  addressTop: {
    fontSize: 10,
    fontWeight: 800,
    marginBottom: 5,
  },
  addressBody: {
    fontSize: 12,
    fontWeight: 500,
  },
  acknowledgement: {
    alignSelf: "center",
    fontSize: 9, // Reduced
    marginTop: 10,
    marginHorizontal: 20,
    textAlign: "center",
  },
  dashedLine: {
    borderBottom: 1,
    borderStyle: "dashed",
    borderColor: "#000",
    marginVertical: 10,
  },
  dateFormat: {
    fontSize: 6,
    fontWeight: 100,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  orderInfo: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  tab: {
    alignSelf: "flex-end",
    textAlign: "left",
    width: "40%",
  },
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#e3e3e3",
  },
  tableCellItem: {
    flex: 2, // More width for item name
    padding: 5,
    fontSize: 9, // Smaller text
  },
  tableCellSmall: {
    flex: 0.7, // Narrow columns
    padding: 5,
    fontSize: 9,
    textAlign: "center",
  },
  total: {
    alignSelf: "flex-end",
    marginTop: 10,
    width: "40%",
    textAlign: "left",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 30,
    fontSize: 10,
  },
  barcodeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 40,
  },
  barcodePath: {},
});

const generateBarcodeData = (orderId: string) => {
  try {
    // Create a canvas element in the DOM
    const canvas = document.createElement('canvas');
    
    // Generate the barcode on the canvas
    bwipjs.toCanvas(canvas, {
      bcid: "code128", // Barcode type
      text: orderId, // Text to encode
      textsize: 6,
      textfont: "Monospace-Bold",
      textyoffset: 1,
      textgaps: 1,
      scale: 3, // 3x scaling factor
      height: 15, // Barcode height in mm
      includetext: true, // Show human-readable text
      textxalign: "center",
    });
    
    // Convert the canvas to base64 PNG
    const base64Image = canvas.toDataURL('image/png');
    
    return base64Image;  // Return base64-encoded image data
  } catch (error) {
    console.error('Error generating barcode:', error);
    return '';
  }
};


// Single Order Page component
const OrderPage = ({ order }: { order: OrderWithUser }) => {
  let shippingAddress;
  try {
    shippingAddress = JSON.parse(order.shipping_address);
  } catch (error) {
    shippingAddress = null;
    toast.error("Wrong address format found.");
  }
  const barcodeData = generateBarcodeData((order._id).toString());

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.barcodeContainer}>
        {barcodeData && <Image src={barcodeData} />}
      </View>

      <View style={styles.header}>
        <Text style={styles.addressTop}>Ship to :</Text>
        <Text style={styles.addressBody}>{order?.userDetails?.user?.username}</Text>
        <Text style={styles.addressBody}>{shippingAddress?.specific_location}</Text>
        <Text style={styles.addressBody}>{shippingAddress?.area}</Text>
        <Text style={styles.addressBody}>{shippingAddress?.landmark}</Text>
        <Text
          style={styles.addressBody}
        >{`${shippingAddress?.town_or_city}, ${shippingAddress?.state} - ${shippingAddress?.pincode}`}</Text>
        <Text style={styles.addressBody}>Phone : {order.userDetails?.user?.phone_number}</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Date: {new Date(order?.created_at).toLocaleDateString('en-GB')}{" "}
          <Text style={styles.dateFormat}>DD/MM/YYYY</Text>
        </Text>
        <Text>Order ID: {order?._id}</Text>
        <Text>Order Number: {order?.order_number}</Text>
      </View>

      <View style={styles.dashedLine} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellItem}>Item</Text>
            <Text style={styles.tableCellSmall}>Qty</Text>
            <Text style={styles.tableCellSmall}>Price</Text>
            <Text style={styles.tableCellSmall}>Total</Text>
          </View>
          {order.order_items.map((item) => (
            <View key={item?.order_item_id} style={styles.tableRow}>
              <Text style={styles.tableCellItem}>
                {item?.product_details.product_name}
              </Text>
              <Text style={styles.tableCellSmall}>{item?.quantity}</Text>
              <Text style={styles.tableCellSmall}>₹{item?.price}</Text>
              <Text style={styles.tableCellSmall}>₹{item?.total_amount}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text>Order Summary</Text>
        <Text style={styles.tab}>Total Amount: ₹{order?.total_amount}</Text>
        <Text style={styles.tab}>Discount: ₹{order?.discount_amount}</Text>
        <Text style={styles.tab}>Shipping: ₹{order?.shipping_amount}</Text>
        <Text style={styles.total}>Net Amount: ₹{order?.net_amount}</Text>
      </View>

      <Text style={styles.acknowledgement}>
        Thanks for buying on Apni Dukan. To provide feedback for the
        seller please visit giveUsFeedback.com . To contact the seller, go to
        Your Orders in Your Account and Click "Contact the Seller".
      </Text>
    </Page>
  );
};


// Multi-page PDF Document component
const OrdersPDF = ({ orders }: { orders: Order[] }) => {
 
  return (
    <Document>
      {orders.map((order) => (
        <OrderPage key={order._id} order={order} />
      ))}
    </Document>
  );
};


const DownloadOrderSlip = () => {
  const [orders, setOrders] = useState<OrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtract 1 day to get yesterday
    return yesterday.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchUserDetails = async (order: Order): Promise<OrderWithUser> => {
    try {
      const userData = await getUserApi({
        user_id: order.user_id,
        user_phone_number: null
      });
      
      return {
        ...order,
        userDetails: userData
      };
    } catch (err) {
      console.error(`Failed to fetch user details for order ${order.order_number}:`, err);
      return order; // Return order without user details if fetch fails
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const startTime = new Date(filterDate)
        .toISOString()
        .replace("T00:00:00.000Z", "T00:00:00");
      const endTime = new Date(filterDate)
        .toISOString()
        .replace("T00:00:00.000Z", "T23:59:59");

      const response: any = await getAllOrdersNoPaginationApi({
        start_time: startTime,
        end_time: endTime,
      });
      const orders = response.orders;
      const paidOrders = orders.filter((order:any) => order.payment_status === "paid");

      const ordersWithUsers = await Promise.all(
        paidOrders.map((order: Order) => fetchUserDetails(order))
      );
      
      setOrders(ordersWithUsers);
      console.log(ordersWithUsers);
      

    } catch (err: any) {
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="text-center mt-10">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
        <h1 className="text-lg sm:text-2xl font-bold">Daily Orders Report</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border rounded text-sm sm:text-base"
          />
          <button
            onClick={fetchOrders}
            className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filter Orders
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          No orders found for this date.
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                Orders for {formatDate(filterDate)}
              </h2>
              <p className="text-gray-600">Total Orders: {orders.length}</p>
            </div>
            <PDFDownloadLink
              document={<OrdersPDF orders={orders} />}
              fileName={`orders-${filterDate}.pdf`}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              {({  loading }) =>
                loading ? "Generating PDF..." : "Download Daily Report"
              }
            </PDFDownloadLink>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Order Summary:</h3>
            <div className="space-y-2">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.total_amount}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadOrderSlip;
