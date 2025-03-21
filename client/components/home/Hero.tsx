import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart } from 'react-icons/fi';

export const Hero = () => {
  return (
    <div className="overflow-hidden bg-gray-100">
      <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col px-4 md:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center pt-10 md:items-start md:px-4 md:pt-0">
          <span
            data-aos="fade-down"
            data-aos-delay="200"
            className="mb-2.5 rounded-md bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-600 md:mb-5"
          >
            Limited Time Offer!
          </span>
          <h2
            data-aos="fade-right"
            data-aos-delay="300"
            className="mb-5 text-center text-[2.5rem] font-bold leading-tight text-black md:text-left md:text-5xl"
          >
            Discover the Latest Trends
          </h2>
          <h3
            data-aos="fade-right"
            data-aos-delay="400"
            className="font-regular mb-5 text-center text-lg leading-tight text-neutral-700 md:mb-10 md:text-left"
          >
            Shop the newest arrivals and stay ahead of the fashion curve.
          </h3>
          <Link
            href="/shop"
            data-aos="fade-up"
            data-aos-delay="500"
            className="mb-10 flex items-center rounded bg-zinc-900 px-8 py-2.5 text-base font-normal text-white shadow-sm shadow-zinc-500"
          >
            <FiShoppingCart />
            <span className="ml-2">Start Shopping</span>
          </Link>
          <div
            className="mb-5 flex w-full flex-wrap justify-center md:justify-between"
            data-aos-delay="600"
            data-aos="fade"
          >
            {["bazaar", "bustle", "versace", "instyle"].map((brand, index) => (
              <Image
                priority
                key={index}
                src={`/assets/${brand}.svg`}
                alt={`${brand} brand`}
                width={100}
                height={50}
                className="mx-4 my-1"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-end justify-start">
          <Image
            priority
            src="/assets/hero.webp"
            alt="hero"
            quality={100}
            width={550}
            height={550}
            data-aos="fade-up"
          />
        </div>
      </div>
    </div>
  );
};
