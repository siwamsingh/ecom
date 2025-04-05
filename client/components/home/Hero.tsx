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
          <h1
            data-aos="fade-right"
            data-aos-delay="300"
            className="mb-5 text-center text-[2.5rem] font-bold leading-tight text-black md:text-left md:text-4xl"
          >
            Discover Affordable Books for Every Reader
          </h1>
          <h2
            data-aos="fade-right"
            data-aos-delay="400"
            className="font-regular mb-5 text-center text-base leading-tight text-neutral-600 md:mb-10 md:text-left"
          >
            At Book4Value.com, we bring you handpicked titles for all your academic and leisure needs. We have something for everyone <strong>—delivered right to your doorstep.</strong>
      
          </h2>
          <Link
            href="/products/all-products?category_id=&category=&search=&page=1"
            data-aos="fade-up"
            data-aos-delay="500"
            className="mb-10 flex items-center rounded bg-zinc-900 px-8 py-2.5 text-base font-normal text-white shadow-sm shadow-zinc-500"
          >
            <FiShoppingCart />
            <span className="ml-2">Start Shopping</span>
          </Link>
          <div
            className="mb-5 flex gap-4 w-full flex-wrap justify-center md:justify-between"
            data-aos-delay="600"
            data-aos="fade"
          >
           
      <span className="text-gray-500 text-[1.7rem] font-serif tracking-widest opacity-50">BestBooks</span>
      <span className="text-gray-500 text-[1.7rem] font-bold italic opacity-50">UPSC</span>
      <span className="text-gray-500 text-[1.7rem] font-serif tracking-wide opacity-50">CBSE</span>
      <span className="text-gray-500 text-[1.7rem] font-semibold opacity-50">NewArrivals</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-start">
        <Image
            src="/assets/hero1.webp"
            alt="Books flying in the air and opening knowledge"
            width={550}
            height={550}
            priority
            sizes="(max-width: 768px) 100vw, 550px"
            className="w-full h-auto max-w-[550px]"
          />
        </div>
      </div>
    </div>
  );
};
