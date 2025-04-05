"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import OrderSummary from "@/components/order/OrderSummary";
import OrderDetails from "@/components/order/OrderDetails";
import OrderSuccess from "@/components/order/OrderSuccess";
import ImportantInformation from "@/components/order/ImportantInformation";
import LoadingState from "@/components/order/LoadingState";
import ErrorState from "@/components/order/ErrorState";

import { Product, OrderItem, Coupon, Address } from "@/components/order/types";
import StoreProvider from "@/app/StoreProvider";
import { openRazorpay } from "@/utils/razorpay";

function OrderConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>({order_id: null, amount: null});
  const [btnDisable, setDisable] = useState<boolean>(false);

  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [grossAmount, setGrossAmount] = useState(0);

  // Parse URL parameters on component mount
  useEffect(() => {
    const parseUrlParams = async () => {
      try {
        setIsLoading(true);

        // Get product items from URL
        const productParams = searchParams.get("products");
        if (!productParams) {
          throw new Error("No products specified in URL");
        }

        // Parse product IDs and quantities
        const parsedItems: OrderItem[] = [];
        const itemsArray = productParams.split(",");

        for (const item of itemsArray) {
          const [productId, quantity] = item.split(":");

          if (!productId || !quantity) {
            throw new Error("Invalid product format in URL");
          }

          const parsedQuantity = parseInt(quantity);

          // Validate quantity based on backend requirements
          if (parsedQuantity <= 0 || parsedQuantity > 5) {
            throw new Error(
              `Quantity for product ${productId} must be between 1 and 5`
            );
          }

          parsedItems.push({
            product_id: parseInt(productId),
            price: 0,
            quantity: parsedQuantity,
            total_amount: 0,
          });
        }

        // Validate number of unique products based on backend requirements
        const uniqueProductIds = new Set(
          parsedItems.map((item) => item.product_id)
        );
        if (uniqueProductIds.size === 0 || uniqueProductIds.size > 5) {
          throw new Error("Number of unique products must be between 1 and 5");
        }

        setOrderItems(parsedItems);

        // Fetch product details
        await fetchProductDetails(
          parsedItems.map((item) => item.product_id),
          parsedItems
        );

        // // Fetch user addresses
        await fetchAddresses();
      } catch (err: any) {
        setError(err.message || "Failed to process order details");
        toast.error(err.message || "Failed to process order details");
      } finally {
        setIsLoading(false);
      }
    };

    parseUrlParams();
  }, [searchParams]);

  // Calculate totals whenever order items or selected coupon changes
  useEffect(() => {
    calculateOrderAmounts();
  }, [orderItems, selectedCoupon, products]);

  // Fetch product details for the given product IDs
  const fetchProductDetails = async (
    productIds: number[],
    parsedItems: OrderItem[]
  ) => {
    try {

      // Fetch each product individually using Promise.all
      const productRequests = productIds.map(async (productId) => {
        const response = await axios.post(`/api/products/details`, {
          product_id: productId,
        });

        if (response.data.success) {
          return response.data.data; // Assuming API returns product details
        } else {
          toast.error(`Failed to fetch details for product ID ${productId}`);
          return null;
        }
      });

      const fetchedProducts = await Promise.all(productRequests);
      const validProducts = fetchedProducts.filter(
        (product) => product !== null
      );
      const extractedProducts: Product[] = validProducts.map((p) => p.product);

      setProducts(extractedProducts);

      // Update order items with product details
      const updatedOrderItems = parsedItems.map((item) => {
        const product = extractedProducts.find(
          (p: Product) => Number(p._id) === Number(item.product_id)
        );

        if (!product) {
          toast.error(`Product with ID ${item.product_id} not found`);
          return item;
        }

        if (product.stock_quantity < item.quantity) {
          setDisable(true);
        }

        return {
          ...item,
          product_id: Number(product._id),
          price: product.price,
          total_amount: product.price * item.quantity,
        };
      });

      setOrderItems(updatedOrderItems);
    } catch (err: any) {

      setError(err.message || "Failed to fetch product details");
      toast.error(err.message || "Failed to fetch product details");
    }
  };

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      const response = await axios.post<any>("/api/address/get-address", {});

      if(!response.data.success){
        toast.error("Failed to load your saved addresses");
      }
      
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data?.addresses)
      ) {
        const addresses = response.data.data.addresses;
        setAddresses(addresses);

        let fndDefaultAddr = false;
        addresses.map((addr: Address) => {
          if (addr.is_default) {
            setSelectedAddress(addr._id);
            fndDefaultAddr = true;
          }
        });

        if (!fndDefaultAddr && response.data.data.length > 0) {
          setSelectedAddress(response.data.data[0]._id);
        }
      } else {
        throw new Error(response.data.message || "Invalid response format");
      }
    } catch (err:any) {
      if(err?.response?.status === 477){
        toast.error("Login to continue.");
         setTimeout(()=>{router.push("/auth/login")},3000);
         return;
        
    }

        if(err?.response?.status === 577 ){
            toast.error("Session Expired. Login to continue.");
             setTimeout(()=>{router.push("/auth/login")},3000);
             return;
            
        }
      toast.error("Failed to load your saved addresses");
    }
  };

  // Calculate order amounts
  const calculateOrderAmounts = () => {
    if (!products.length || !orderItems.length) return;

    let total = 0;
    let discount = 0;

    orderItems.forEach((item) => {
      total += item.price * item.quantity;
    });

    // Apply coupon discount if selected
    if (selectedCoupon) {
      const coupon = selectedCoupon;
      if (coupon) {
        const applicableItem = orderItems.find(
          (item) => item.product_id === coupon.product_id
        );

        if (applicableItem) {
          const itemTotal = applicableItem.price * applicableItem.quantity;
          discount = parseFloat(
            ((itemTotal * Number(coupon.discount_value)) / 100).toFixed(2)
          );
        }
      }
    }

    setTotalAmount(total);
    setDiscountAmount(discount);
    setGrossAmount(total - discount);
  };

  // Handle coupon selection
  const handleCouponChange = (selectedCoupon: Coupon) => {
    setSelectedCoupon(selectedCoupon);
  };

  // Handle address selection
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(parseInt(e.target.value));
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }
  
    if (orderItems.length === 0 || orderItems.length > 5) {
      toast.error("Order must have 1 to 5 items only.");
      return;
    }
  
    const productIds = orderItems.map((item) => item.product_id);
    const uniqueIds = new Set(productIds);
    if (uniqueIds.size !== productIds.length) {
      toast.error("Duplicate products detected in order.");
      return;
    }
  
    for (const item of orderItems) {
      if (item.quantity <= 0 || item.quantity > 5) {
        toast.error(
          `Quantity for product ${item.product_id} must be between 1 and 5.`
        );
        return;
      }
    }
  
    try {
      setIsLoading(true);
  
      const payload = {
        order_items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_address_id: selectedAddress,
        coupon_code: selectedCoupon?.coupon_code || undefined,
      };
  
      const response = await axios.post("/api/order/create-order", payload);
  
      if (response.data.success) {
        setOrderPlaced(true);
        setOrderDetails(response.data.data);
        toast.success("Order placed successfully!");
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to place order";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!orderDetails){
      toast.error("Order Id missing.")
      return;}

    try {
      if(!orderDetails.order_id || !orderDetails.amount){
        toast.error("Some thing went wrong while payment.")
        return
      }
      await openRazorpay({
        orderId: orderDetails?.order_id ,
        amount: orderDetails?.amount ,
        prefill: {
          name: "Siwam Singh",
          email: "siwamsingh2003@gmail.com",
        },
      });
      
    } catch {
      
      toast.error("Failed to process payment");
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onReturnToProducts={() => router.push("/products")}
      />
    );
  }

  return (
    <div className="min-h-screen  bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {orderPlaced ? "Order Confirmed" : "Order Confirmation"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {orderPlaced
              ? "Your order has been placed successfully. Please proceed to payment."
              : "Review your order details before placing your order."}
          </p>
        </div>

        {/* Order summary card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <OrderSummary orderItems={orderItems} products={products} />

          <StoreProvider>
            <OrderDetails
              addresses={addresses}
              products={products}
              selectedAddress={selectedAddress}
              handleAddressChange={handleAddressChange}
              handleCouponChange={handleCouponChange}
              totalAmount={totalAmount}
              discountAmount={discountAmount}
              grossAmount={grossAmount}
              orderPlaced={orderPlaced}
            />
          </StoreProvider>

          {/* Action buttons */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            {orderPlaced ? (
              <button
                onClick={handlePayment}
                className="px-6 py-3 bg-yellow-400 text-slate-800 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 flex items-center font-semibold"
                disabled={isLoading}
              >
                Pay Now
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                className={`px-6 py-3 bg-blue-600 disabled:bg-gray-400 text-white rounded-md disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center`}
                disabled={isLoading || !selectedAddress || btnDisable}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  "Confirm Order"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Order success message */}
        {orderPlaced && <OrderSuccess orderId={orderDetails?.order_id} />}

        {/* Important notes */}
        <ImportantInformation />
      </div>
    </div>
  );
}

export default OrderConfirmation;
