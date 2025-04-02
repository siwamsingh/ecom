import Link from "next/link";
import { Dancing_Script, Geist, Geist_Mono } from "next/font/google";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function PrivacyPolicy() {
  return (
    <div className={`max-w-3xl mx-auto p-6 bg-white text-slate-700 ${geistSans.variable} font-sans`}>
      <h1 className={`text-4xl font-bold text-blue-600 mb-4 ${dancingScript.variable} font-serif`}>
        Privacy Policy
      </h1>
      <p className="text-gray-500 mb-6">Effective Date: March 2025</p>

      <section className="mb-6">
        <h2 className={`text-2xl font-semibold text-blue-500 ${dancingScript.variable} font-serif`}>
          1. General Information
        </h2>
        <p>
          Welcome to <strong className="text-blue-600">book4value.com</strong>. We value your privacy and are committed to protecting your personal data. 
          We collect certain personal information to enhance your shopping experience, and we ensure that only you have access to it.
        </p>
      </section>

      <section className="mb-6">
        <h2 className={`text-2xl font-semibold text-blue-500 ${dancingScript.variable} font-serif`}>
          2. Data Collection & Usage
        </h2>
        <p>We collect the following personal information:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li><strong>Name:</strong> For account creation and order processing.</li>
          <li><strong>Delivery Location:</strong> To ensure smooth order delivery.</li>
          <li><strong>Products in Cart:</strong> So users can access their cart across devices.</li>
          <li><strong>Phone Number:</strong> For contacting users regarding orders, cancellations, or delivery issues.</li>
          <li><strong>Password:</strong> Stored securely using encryption.</li>
        </ul>
        <p className="mt-2">
          We use cookies to manage user sessions and enhance your browsing experience.
        </p>
      </section>

      <section className="mb-6">
        <h2 className={`text-2xl font-semibold text-blue-500 ${dancingScript.variable} font-serif`}>
          3. Data Sharing & Third Parties
        </h2>
        <p>We do not sell or share your personal data with third parties for marketing purposes. However, we use:</p>
        <ul className="list-disc ml-6">
          <li><strong className={`${geistMono.variable} font-mono`}>Razorpay:</strong> For secure payment processing.</li>
          <li><strong className={`${geistMono.variable} font-mono`}>Indian Post:</strong> For delivering your orders.</li>
        </ul>
        <p>We do not use Google Analytics, Facebook Pixel, or any other tracking services.</p>
      </section>

      <section className="mb-6">
        <h2 className={`text-2xl font-semibold text-blue-500 ${dancingScript.variable} font-serif`}>
          4. User Rights & Control
        </h2>
        <p>
          Users cannot delete their accounts themselves, as we must keep a record of past purchases.
          However, users can{" "}
          <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
            contact us
          </Link>{" "}
          via phone or email for account-related requests, such as data recovery or modification.
        </p>
        <p className="mt-2">We do not send marketing emails or SMS notifications.</p>
      </section>

      <section className="mb-6">
        <h2 className={`text-2xl font-semibold text-blue-500 ${dancingScript.variable} font-serif`}>
          5. Security & Compliance
        </h2>
        <p>
          We take security seriously and implement encryption for sensitive data like passwords and OTPs.
          Our platform runs on secure servers to ensure data protection.
        </p>
        <p className="mt-2">Since we operate only in India, we do not follow GDPR or CCPA regulations.</p>
      </section>

      <section className="mb-6">
        <h2 className={`text-2xl font-semibold text-blue-500 ${dancingScript.variable} font-serif`}>
          6. Contact & Updates
        </h2>
        <p>
          If you have any privacy concerns,{" "}
          <Link href="/contact" className="text-blue-600 font-semibold hover:underline">
            contact us here
          </Link>
          . We may update this Privacy Policy as needed, and changes will be reflected on this page.
        </p>
      </section>

      <p className="mt-4 text-gray-500">Last updated: March 2025</p>
    </div>
  );
}
