import Image from "next/image";
import Link from "next/link";
import {
  BsFacebook,
  BsGithub,
  BsLinkedin,
  BsTwitter,
  BsInstagram,
} from "react-icons/bs";

const socialMedias = [
  { Icon: BsInstagram, href: "https://instagram.com" },
  { Icon: BsTwitter, href: "https://twitter.com" },
  { Icon: BsFacebook, href: "https://facebook.com" },
  { Icon: BsLinkedin, href: "https://linkedin.com" },
];

const footerLinks = [
  {
    label: "Company",
    links: [
      ["About", "/about"],
      ["Terms and Conditions", "/terms-and-conditions"],
      ["Privacy Policy", "/privacy-policy"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    label: "Support",
    links: [
      ["Help", "/help"],
      ["Contact Seller", "/contact"],
    ],
  },
  {
    label: "Contact",
    links: [
      ["Whatsapp", "/contact"],
      ["Phone", "/contact"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mb-16 bg-white md:mb-0">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col md:flex-row">
          {/* Logo & About */}
          <div className="flex flex-col md:flex-1">
            <Link href="/">
              <Image
                priority
                src="/logo-b.png"
                alt="Book4Value.com Logo"
                width={100}
                height={35}
                quality={100}
              />
            </Link>
            <p className="py-4 text-sm font-normal text-neutral-500">
              Small, artisan label that offers a thoughtfully curated collection
              of high-quality everyday essentials.
            </p>
            {/* Social Media */}
            <div className="my-5 flex justify-center md:justify-start">
              {socialMedias.map(({ Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  className="mr-2 rounded-lg bg-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-300 hover:text-neutral-700"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-5 flex justify-between md:mt-0 md:flex-[2] md:justify-around">
            {footerLinks.map(({ label, links }) => (
              <div key={label} className="flex flex-col">
                <strong className="mb-5 text-sm font-bold text-neutral-600 md:text-base">
                  {label}
                </strong>
                <ul className="flex flex-col gap-2 text-xs font-normal text-neutral-500 md:text-sm">
                  {links.map(([text, href]) => (
                    <Link
                      key={href + text}
                      href={href}
                      className="transition hover:text-neutral-700"
                    >
                      {text}
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-neutral-100">
        <div className="mx-auto max-w-7xl px-2 py-3">
          <div className="flex flex-col items-center justify-between gap-3 text-xs font-medium text-neutral-700 md:flex-row">
            <p>Copyright © 2025 Siwam Singh</p>
            <Link href="https://github.com/siwamsingh/ecom" target="_blank">
              <BsGithub size="1.25rem" />
            </Link>
            <p>
              Created By{" "}
              <strong>
                <Link href="https://github.com/siwamsingh" target="_blank">
                  Siwam
                </Link>
              </strong>
              . All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-10 max-w-screen-xl mx-auto">
        <hr className="mb-6 border-gray-300" />
        <h1 className=" text-base sm:text-lg  font-bold text-gray-700 mb-3">
          Book4Value: Your Trusted Online Bookstore in India
        </h1>
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
    </footer>
  );
}
