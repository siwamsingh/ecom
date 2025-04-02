
import Link from "next/link";
import { Dancing_Script, Geist } from "next/font/google";
import MainLayout from "../MainLayout";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function AboutUs() {
  return (
    <MainLayout>
      <div
        className={`max-w-4xl mx-auto p-6 bg-white text-slate-700 ${geistSans.variable} font-sans`}
      >
        <h1
          className={`text-4xl font-bold text-slate-800 mb-4 ${dancingScript.variable} font-serif`}
        >
          About Us
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-700">
            What is Book4Value.com?
          </h2>
          <p className="mt-2">
            <strong className="text-blue-500">Book4Value.com</strong> is a
            platform designed for students who struggle to find affordable
            books. We offer a wide range of books at unbeatable prices, ensuring
            that knowledge remains accessible to everyone.
          </p>
        </section>

        <section className="mb-8 ">
          <h2 className="text-2xl font-semibold text-slate-700">
            What Makes Us Unique?
          </h2>
          <p className="mt-2">
            Unlike other platforms, we keep our profit margins low and focus on
            quantity. This allows us to offer the lowest prices possible.
            Instead of automated bots, we believe in real customer interaction,
            ensuring satisfaction through direct calls.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-700">
            Our Founder & Mission
          </h2>
          <p className="mt-2">
            Book4Value.com was founded by{" "}
            <strong className="text-blue-500">Siwam Kumar Singh</strong>, who is
            also the developer of this platform. His goal is to ensure that
            students never miss out on education due to artificially inflated
            book prices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-700">
            How It Works
          </h2>
          <p className="mt-2">
            Customers can buy books directly from the product page or add them
            to their cart. During checkout, they can select an address and apply
            discounts. After confirming the order, they proceed to payment via
            Razorpay. Once paid, the order appears in their order history.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-700">
            Customer Trust & Quality
          </h2>
          <p className="mt-2">
            We source our books from trusted wholesalers and use reliable
            courier services. In case of any issues, we strive to resolve them
            quickly.
            <Link
              href="/help"
              className="text-blue-700 font-medium hover:underline"
            >
              {" "}
              Visit our Help page
            </Link>{" "}
            for more details.
          </p>
          <p className="mt-2">
            We also offer a{" "}
            <strong className="text-slate-500">7-day return guarantee</strong>.
            Learn more in our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-blue-700 font-medium hover:underline"
            >
              {" "}
              Terms & Conditions
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-700">
            Stay Connected
          </h2>
          <p className="mt-2">
            Follow us on social media for updates and special offers.
            <Link
              href="/contact"
              className="text-blue-700 font-medium hover:underline"
            >
              {" "}
              Visit our Contact page
            </Link>{" "}
            for details.
          </p>
        </section>

        <p className="mt-6 text-gray-500">Last updated: March 2025</p>
      </div>
    </MainLayout>
  );
}
