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
  
    const paymentOptions = {
      key: process.env.RAZORPAY_KEY ,
      amount: options.amount,
      currency: "INR",
      order_id: options.orderId,
      name: options.name || "Book4Value",
      description: options.description || "Payment to Book4Value",
      image: options.image || "/logo-t2.png", 
      callback_url: process.env.NEXT_PUBLIC_BASE_URL+"/order/my-orders" ,
      prefill: options.prefill || {
        name: "siwam singh",
        email: "siwamsingh2003@gmail.com",
      },
      theme: {
        color: "#F4C430",
      },
    };
  
    const paymentObject = new (window as any).Razorpay(paymentOptions);
    paymentObject.open();
  };
  