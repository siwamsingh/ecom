// utils/razorpay.ts
export const loadScript = (src: string) => {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface RazorpayOptions {
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  callback_url?: string;
}

export const openRazorpay = async (options: RazorpayOptions) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Failed to load Razorpay SDK. Please check your internet connection.");
    return;
  }

  const rp_key = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  
  const paymentOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || rp_key,
    amount: options.amount, // amount in paisa
    currency: "INR",
    order_id: options.orderId,
    name: options.name || "Book4Value",
    description: options.description || "Payment to Book4Value",
    image: options.image || "/logo-b.png",
    prefill: options.prefill || {
      name: "Siwam Singh",
      email: "siwamsingh2003@gmail.com",
    },
    theme: {
      color: "#F4C430",
    },
    // Use handler instead of callback_url
    handler: function (response: any) {
      // Redirect with payment details as query parameters
      const url = new URL(`${baseUrl}/order/success`); 
      url.searchParams.append("razorpay_payment_id", response.razorpay_payment_id);
      url.searchParams.append("razorpay_order_id", response.razorpay_order_id);
      url.searchParams.append("razorpay_signature", response.razorpay_signature);
      
      // Redirect to success page with parameters
      window.location.href = url.toString();
    },
    // Optional: Handle when payment modal is closed
    modal: {
      ondismiss: function() {
        console.log("Payment dismissed");
        // Optional: Redirect to a cancel page
        // window.location.href = `${baseUrl}/order/cancel`;
      }
    }
  };
  
  const paymentObject = new (window as any).Razorpay(paymentOptions);
  paymentObject.open();
};