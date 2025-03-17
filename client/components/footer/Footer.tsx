import Image from "next/image";
import Link from "next/link";
import { BsFacebook, BsGithub, BsLinkedin, BsTwitter, BsInstagram } from "react-icons/bs";

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
      ["Term of Use", "/term-of-use"],
      ["Privacy Policy", "/privacy-policy"],
      ["How it Works", "/how-works"],
      ["Contact Us", "/contact-us"],
    ],
  },
  {
    label: "Support",
    links: [
      ["Support Career", "/support"],
      ["24h Service", "/24-service"],
      ["Quick Chat", "/quick-chat"],
    ],
  },
  {
    label: "Contact",
    links: [
      ["Whatsapp", "/whatsapp"],
      ["Support 24", "/24-service"],
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
              <Image priority src="/logo-b.png" alt="Kara Shop Logo" width={100} height={35} quality={100} />
            </Link>
            <p className="py-4 text-sm font-normal text-neutral-500">
              Small, artisan label that offers a thoughtfully curated collection of high-quality everyday essentials.
            </p>
            {/* Social Media */}
            <div className="my-5 flex justify-center md:justify-start">
              {socialMedias.map(({ Icon, href }) => (
                <Link key={href} href={href} target="_blank" className="mr-2 rounded-lg bg-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-300 hover:text-neutral-700">
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-5 flex justify-between md:mt-0 md:flex-[2] md:justify-around">
            {footerLinks.map(({ label, links }) => (
              <div key={label} className="flex flex-col">
                <strong className="mb-5 text-sm font-bold text-neutral-600 md:text-base">{label}</strong>
                <ul className="flex flex-col gap-2 text-xs font-normal text-neutral-500 md:text-sm">
                  {links.map(([text, href]) => (
                    <Link key={href} href={href} className="transition hover:text-neutral-700">
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
            <p>Copyright © 2022 KARA Shop</p>
            <Link href="https://github.com/mehrabmp/kara-shop" target="_blank">
              <BsGithub size="1.25rem" />
            </Link>
            <p>
              Created By{" "}
              <strong>
                <Link href="https://github.com/mehrabmp" target="_blank">Mehrab</Link>
              </strong>
              . All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
