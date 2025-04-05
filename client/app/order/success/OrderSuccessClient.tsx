"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      const razorpay_payment_id = searchParams.get("razorpay_payment_id");
      const razorpay_order_id = searchParams.get("razorpay_order_id");
      const razorpay_signature = searchParams.get("razorpay_signature");

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        setStatus("failed");
        return;
      }

      try {
        const res = await axios.post("/api/order/verify-payment", {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });

        if (res.data.success) {
          toast.success("Payment verified successfully!");
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {status === "verifying" && <p className="text-lg font-medium">Verifying your payment...</p>}
      {status === "success" && (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful 🎉</h1>
          <p className="text-gray-600 mb-4">Thank you! Your order has been placed successfully.</p>
          <a
            href="/order/my-orders"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            View My Orders
          </a>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed ❌</h1>
          <p className="text-gray-600 mb-4">Something went wrong. Please contact support.</p>
          <a
            href="/contact"
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Contact Support
          </a>
        </>
      )}
    </div>
  );
}
