import Link from "next/link";
import { Dancing_Script, Geist } from "next/font/google";
import { Metadata } from "next";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions related to the service provided by Book4Value.com",
};


export default function TermsAndConditions() {
  return (
    <div className={`max-w-3xl mx-auto p-6 bg-white text-slate-700 ${geistSans.variable} font-sans`}>
      <h1 className={`text-4xl font-bold text-blue-600 mb-4 ${dancingScript.variable} font-serif`}>
        Terms and Conditions
      </h1>
      <p className="text-gray-500 mb-6">Effective Date: March 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">1. General Information</h2>
        <p>
          Welcome to <strong>book4value.com</strong>. This website is owned and operated by <strong>Siwam Kumar Singh</strong>, 
          who is also the developer of the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">2. User Accounts & Responsibilities</h2>
        <p>
          Users can freely browse products and discounts, but an account is required to add products to the cart, 
          save addresses, or make purchases. 
        </p>
        <p>
          There is no age restriction for account creation, but minors (under 18) must obtain parental permission 
          and supervision for transactions.
        </p>
        <p>
          Any activity that is fraudulent, illegal, or harms our business or reputation may lead to account suspension or termination.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">3. Orders & Payments</h2>
        <p>
          We use <strong>Razorpay</strong> to process payments, which supports UPI, credit cards, debit cards, and other options.
        </p>
        <p>
          Users can cancel an order before shipping by calling us between <strong>9 AM - 6 PM</strong>. Order modifications are not allowed.
        </p>
        <p>
          Refunds are available if users return items within <strong>7 days</strong> of delivery at their own cost via <strong>Indian Post</strong>. 
          Full refunds may have a <strong>2-3% deduction</strong> for payment processing fees. 
          Users should record a video while opening the sealed parcel and email it to us with the order ID if requesting a refund.
        </p>
        <p>
          After <strong>7 days</strong>, refund requests will not be entertained.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">4. Shipping & Delivery</h2>
        <p>
          We currently ship only within <strong>India</strong>. Delivery usually takes <strong>5-10 days</strong>, 
          but during festive seasons or catastrophic events, it may take up to <strong>16 days</strong>.
        </p>
        <p>
          If an order is lost in transit, users can request a full refund or a free replacement.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">5. Liabilities & Disclaimers</h2>
        <p>
          We are not responsible for damages caused during delivery. However, if an item is lost and never reaches the user, 
          we will offer a full refund or send a new order at no extra cost.
        </p>
        <p>
          We ensure the accuracy and quality of product descriptions, but if a user receives the wrong order, 
          they will receive a <strong>100% refund</strong> or a free replacement upon providing a clear, unedited video 
          of the sealed package along with the receipt.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">6. Intellectual Property & Content</h2>
        <p>
          Users are allowed to use images from our website but must give credit to <strong>book4value.com</strong>.
        </p>
        <p>
          We do not allow user-generated content such as reviews or comments.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">7. Changes & Updates</h2>
        <p>
          Prices may change based on market demand, but we strive to keep them reasonable for students.
        </p>
        <p>
          Any updates to our Terms and Conditions will be notified through a <strong>red notification popup</strong> that 
          appears when users visit our website.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-500">8. Contact Information</h2>
        <p>
          For any questions or concerns regarding our Terms and Conditions, please visit our{" "}
          <Link href="/contact" className="text-blue-600 font-medium hover:underline">
            Contact Page
          </Link>.
        </p>
      </section>

      <p className="mt-4 text-gray-500">Last updated: March 2025</p>
    </div>
  );
}
