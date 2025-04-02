import Link from "next/link";
import MainLayout from "../MainLayout";
import { Info } from "lucide-react";
import { Metadata } from "next";

const faqs = [
  {
    question: "How can I place an order on Book4Value.com?",
    answer:
      "You can either buy books directly from the product page or add them to your cart. Click 'Buy Now' or 'Proceed with Checkout' to go to the Order Confirmation page, where you can select your address and apply a coupon if available. After confirming your order, you will be redirected to Razorpay for payment. Upon successful payment, you will be taken to the order history page.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We process payments through Razorpay, which supports UPI, credit cards, debit cards, and other payment options.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 5-10 days. However, during festivals or in case of any unforeseen events, it may take up to 16 days.",
  },
  {
    question: "What should I do if my order is delayed or lost?",
    answer:
      "If you haven’t received your parcel, contact us. We will either refund your amount or send you a replacement for free.",
  },
  {
    question: "How can I return a book and get a refund?",
    answer:
      "You can return an order within 7 days. You must ship the book back at your own cost using Indian Post. Once we receive and verify the return, we will process your refund. You may also refuse to accept the parcel for a refund, but you must contact us once the parcel is returned to us.",
  },
  {
    question: "How long does it take to process a refund?",
    answer:
      "Refunds are processed once we verify the returned book. However, Razorpay may deduct 2-3% as payment processing charges.",
  },
  {
    question: "Can I change my address after placing an order?",
    answer:
      "No, once an order is placed, the address cannot be changed. Ensure your address is correct before confirming your order.",
  },
  {
    question: "I forgot my password. How can I reset it?",
    answer:
      "If you forgot your password, use the 'Forgot Password' option on the login page. However since our website is new to prevent users to take advantage of our system we have disabled it. Contact us to recover account or create a new account.",
  },
  {
    question: "How can I contact customer support?",
    answer: (
      <>
        You can find all our contact details on the{" "}
        <Link href="/contact" className="text-blue-600 underline">
          Contact Page
        </Link>
        .
      </>
    ),
  },
  {
    question: "Do you have a WhatsApp or social media support option?",
    answer:
      "Yes, we have social media accounts. Visit the Contact Page for more details.",
  },
];

export const metadata: Metadata = {
  title: "Help",
  description: "A list of popular questions to help the users",
};


export default function HelpPage() {
  return (
    <MainLayout>
    <div className="max-w-4xl mx-auto p-6 bg-white text-slate-700">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">Help & Support</h1>

      <div className="bg-yellow-50 rounded-xl p-4 my-10 flex items-center mb-6">
                  <Info className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-900">
                  For any more question related to payment and delivery feel free to <a href="/contact" className="text-blue-600 font-semibold underline">contact us</a>.
                  </p>
                </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-slate-50 border border-slate-100 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300"
          >
            <h2 className="text-lg font-semibold text-slate-800">{faq.question}</h2>
            <p className="mt-2 text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>
      
    </div>
    </MainLayout>
  );
}
