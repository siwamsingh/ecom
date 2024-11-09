import Razorpay from "razorpay";
import { ApiError } from "./apiError";
import crypto from 'crypto'

const razorpayIdKey = process.env.RAZORPAY_ID_KEY;
const razorpayIdSecret = process.env.RAZORPAY_ID_SECRET;
if (!razorpayIdSecret || !razorpayIdKey) {
  throw new ApiError(501, "Something went wrong with payment gateway.")
}

const rp = new Razorpay({
  key_id: razorpayIdKey,
  key_secret: razorpayIdSecret,
});

interface rpInput {
  amount: number,
  currency: string,
  receipt?: string,
  payment_capture?: boolean
}


const createOrderPromise = ({
  amount,
  currency,
  receipt = "receipt#1",
  payment_capture = true
}: rpInput) => {
  const createOrder = rp.orders.create({
    amount: amount * 100,
    currency,
    receipt,
    payment_capture
  })

  return createOrder;
}

interface rpVerify {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}

const verifyRazorpayPayment = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }: rpVerify) => {
  const generatedSignature = crypto
    .createHmac('sha256', razorpayIdSecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Payment verification failed. Invalid signature.");
  }
  else {
    return true
  }
}


export { createOrderPromise , verifyRazorpayPayment} 