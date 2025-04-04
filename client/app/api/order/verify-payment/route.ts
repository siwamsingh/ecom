// app/api/order/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    // Log the received parameters for debugging
    console.log("Verifying payment:", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    // Check if all required parameters are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing required parameters");
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_SECRET;
    
    // Check if secret is configured
    if (!secret) {
      console.error("RAZORPAY_SECRET is not defined");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate the expected signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    
    console.log("Generated signature:", generated_signature);
    console.log("Received signature:", razorpay_signature);

    // Compare signatures
    if (generated_signature === razorpay_signature) {
      return NextResponse.json(
        { success: true, message: "Payment confirmed" }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}