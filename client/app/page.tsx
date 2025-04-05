import React from "react";
import { Hero } from "@/components/home/Hero";
import { Promotions } from "@/components/home/Promotions";
import DynamicAnnouncementBar from "@/components/header/DynamicAnnouncementBar";
// import ProductCarousel from "@/components/products/ProductCarousel";
import Footer from "@/components/footer/Footer";
import StoreProvider from "./StoreProvider";
import { Header } from "@/components/header/Header";

function Index() {
  return (
    <div className="lato-normal">
      <main>
        <StoreProvider>
          <Header />
        </StoreProvider>

        <DynamicAnnouncementBar />
        <Hero />

        {/* SEO-boosting Feature Cards */}
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Why Book4Value?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Affordable Pricing</h3>
              <p className="text-slate-700 text-sm">
                We offer books at the lowest prices in India by minimizing profit margins. Perfect for students and book lovers.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Trusted Sellers</h3>
              <p className="text-slate-700 text-sm">
                All our books are sourced from verified wholesalers, ensuring authenticity and quality.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Fast Delivery</h3>
              <p className="text-slate-700 text-sm">
                Reliable courier partners deliver your books on time, anywhere in India.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Customer-First</h3>
              <p className="text-slate-700 text-sm">
                Need help? Talk to a real person, not a bot. We focus on genuine human support and satisfaction.
              </p>
            </div>
          </div>
        </section>


        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "UPSC", desc: "Ace your civil services exams with top-rated UPSC books." },
              { name: "JEE", desc: "Crack engineering entrances with the best JEE preparation materials." },
              { name: "CBSE", desc: "Score high with NCERT-aligned CBSE books for all grades." },
              { name: "Novels", desc: "Explore fiction, non-fiction, and classics at unbeatable prices." },
              { name: "Self-Help", desc: "Invest in personal growth with bestselling self-help titles." },
              { name: "Children's Books", desc: "Fun and educational books to spark young imaginations." },
            ].map((cat) => (
              <div key={cat.name} className="p-6 bg-slate-50 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-slate-700">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>
        
        <Promotions />

        {/* Testimonials */}
        <section className="bg-slate-100 mt-20 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">What Our Customers Say</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <blockquote className="bg-white p-6 rounded-xl shadow">
                <p className="text-slate-700">&quot;Amazing prices and very fast delivery! Book4Value is my go-to for study materials.&quot;</p>
                <footer className="text-sm text-slate-500 mt-2">— Anjali S., Delhi</footer>
              </blockquote>
              <blockquote className="bg-white p-6 rounded-xl shadow">
                <p className="text-slate-700">&quot;Found rare books that weren&apos;t available anywhere else. And they were affordable too!&quot;</p>
                <footer className="text-sm text-slate-500 mt-2">— Rahul M., Bengaluru</footer>
              </blockquote>
            </div>
          </div>
        </section>

  

        {/* Final Call to Action */}
        <section className="my-20 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Join Thousands of Happy Readers</h2>
          <p className="text-slate-600 mb-6">
            Book4Value makes education accessible and reading affordable. Shop now and experience the difference.
          </p>
          <a
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
          >
            Start Shopping
          </a>
        </section>

        <Footer />
        
      <div className="px-4 py-10 max-w-screen-xl mx-auto">
        <hr className="mb-6 border-gray-300" />
        <h2 className=" text-base sm:text-lg  font-bold text-gray-700 mb-3">
          Book4Value: Your Trusted Online Bookstore in India
        </h2>
        <h2 className="text-sm sm:text-base font-semibold text-gray-600 mb-4">
          Affordable, Fast, and Reliable Book Shopping for Students and Readers
        </h2>
        <p className="text-xs text-gray-600 mb-3">
          At <strong>Book4Value.com</strong>, we make finding and buying books
          easier, faster, and more affordable. Whether you’re a student
          preparing for competitive exams or a book lover looking for your next
          great read, we’ve got you covered. Our catalog features a wide range
          of categories, including academic books, fiction, non-fiction, UPSC,
          JEE, NEET, school textbooks, and more — all at prices that won’t burn
          a hole in your wallet.
        </p>
        <p className="text-xs text-gray-600 mb-6">
          We believe every learner deserves access to quality books. That’s why
          we partner with reliable wholesalers and ensure fast, trackable
          delivery to your doorstep. With our 7-day return guarantee, you can
          shop with confidence and peace of mind.
        </p>

        <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
          Why Shop at Book4Value.com?
        </h2>
        <ul className="text-xs list-disc pl-6 text-gray-600 space-y-2 mb-6">
          <li>
            <strong>Affordable Prices:</strong> We operate on minimal profit
            margins to offer the best deals possible.
          </li>
          <li>
            <strong>Diverse Collection:</strong> From CBSE & ICSE textbooks to
            competitive exam preparation and storybooks — all in one place.
          </li>
          <li>
            <strong>Easy Shopping Experience:</strong> Browse, add to cart,
            choose your address, apply coupons, and pay securely via Razorpay.
          </li>
          <li>
            <strong>Customer-First Support:</strong> Forget bots. Talk to real
            people when you need help.
          </li>
          <li>
            <strong>Fast Delivery:</strong> Reliable couriers ensure your books
            arrive on time and in great condition.
          </li>
          <li>
            <strong>Return Policy:</strong> Changed your mind? Return books
            within 7 days, hassle-free.
          </li>
        </ul>

        <p className="text-xs text-gray-600">
          <strong>Book4Value</strong> is committed to making education and
          reading more accessible for everyone in India. Whether you&apos;re shopping
          for school, college, or personal growth, you&apos;ll find the right book at
          the right price.
        </p>
      </div>
      </main>
    </div>
  );
}

export default Index;
