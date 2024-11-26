import axios from "axios";
import React from "react";

function RpCode() {
  const [responseId, setResponseId] = React.useState("");

  const loadScript = (src: any) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount: number) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/orders/create-order",
        {
          amount: amount * 100,
          currency: "INR",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      handleRazorpayScreen(response.data.amount);
    } catch (error) {
      console.log("Error creating Razorpay order:", error);
    }
  };

  const handleRazorpayScreen = async (amount: number) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert(
        "Failed to load Razorpay SDK. Please check your internet connection."
      );
      return;
    }

    const options = {
      key: "rzp_test_kDj2MoMcOx7pcM",
      amount: amount,
      currency: "INR",
      order_id: "order_PKiiFh3j0x8B7S", 
      name: "foon Coders",
      description: "Payment to fon Coders",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu1fwzQ0WNnyp8Za7oI2VNuK2VyKRNXlbgkw&s",

      callback_url: "http://localhost:8000/api/v1/orders/verify-order",
      prefill: {
        name: "don",
        email: "don@gmail.com",
      },
      theme: {
        color: "#F4C430",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="App">
      <button onClick={() => createRazorpayOrder(100)}>Pay ₹100</button>
      {responseId && <p>Payment ID: {responseId}</p>}
      <button
        className="border-2 border-red-500 p-4"
        onClick={async () => {
          try {
            await handleRazorpayScreen(25500);
          } catch (err) {}
        }}
      >
        clivk to pay
      </button>
    </div>
  );
}

export default RpCode;
