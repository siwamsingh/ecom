import Image from 'next/image';
import Link from 'next/link';
import { Collections } from '../types';

export type CollectionType = 'educational' | 'fiction' | 'top selling' | 'new' | 'discounts' | 'contacts';

interface Props {
  collections: Collections;
  onShowMenu: () => void;
  onCloseMenu: () => void;
}

const newItems = [
  { label: 'New Arrivals', href: '/' },
  { label: 'Best Sellers', href: '/' },
  { label: 'Only at Book4Value', href: '/' },
  { label: 'Members Exclusives', href: '/' },
  { label: 'Release Dates', href: '/' },
];

const trendingItems = [
  { label: 'Fall Collection', href: '/' },
  { label: 'Vintage 70s Collection', href: '/' },
  { label: 'Pharrell Premium Basics', href: '/' },
  { label: 'Tee Bundle: 2 for $39 or 3 for $49', href: '/' },
  { label: 'Breast Cancer Awareness Collection', href: '/' },
];

export  function MegaMenu({  collections, onShowMenu, onCloseMenu }: Props) {

  return (
    <div
      onMouseEnter={onShowMenu}
      onMouseLeave={onCloseMenu}
      className="absolute z-[500] w-full border-t border-solid border-neutral-200 bg-white shadow-md shadow-neutral-300"
    >
      <div className="mx-auto flex max-w-7xl">
        <div className="flex flex-1">
          <div className="ml-4 py-8">
            <Link href="/" onClick={onCloseMenu} className="text-sm font-bold uppercase leading-4 tracking-widest text-neutral-800 hover:underline">
              New & Trending
            </Link>
            <ul className="pt-2">
              {newItems.map(({ label, href }, index) => (
                <li key={index}>
                  <Link href={href} className="mb-1.5 text-xs font-normal text-neutral-700 hover:underline" onClick={onCloseMenu}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mb-2 pt-3">
              {trendingItems.map(({ label, href }, index) => (
                <li key={index}>
                  <Link href={href} className="mb-1.5 text-xs font-normal text-neutral-700 hover:underline" onClick={onCloseMenu}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/discounts" onClick={onCloseMenu}>
              <Image priority src="/assets/offer.webp" alt="offer" width={150} height={100} quality={100} />
            </Link>
          </div>
        </div>
        <div className="flex flex-[3] border-l border-solid shadow-neutral-300">
          {collections && collections.map(collection => (
            <div key={collection.id} className="ml-4 w-full max-w-[150px] py-8">

              <div className="text-sm font-bold uppercase leading-4 tracking-widest text-neutral-800 ">
{collection.name}
              </div>
              <ul className="pt-2">
                {collection.children
                  .map(subCollection => (
                    <li key={subCollection.id}>
                      <Link href={`/products/all-products?category-id=${subCollection.id}&category=${subCollection.slug}&search=`} className="mb-1.5 text-xs font-normal text-neutral-700 hover:underline" onClick={onCloseMenu}>
                        {subCollection.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-solid shadow-neutral-300">
        <div className="mx-auto flex max-w-7xl">
          <div className="flex flex-1 items-center">
            <Link href="/" className="ml-4 w-full max-w-[150px] py-3 text-xs font-bold text-neutral-800 hover:underline" onClick={onCloseMenu}>
              Discount
            </Link>
          </div>
          <div className="flex flex-[3] items-center">
            {[
              {name:'Top Selling',url:"/products/all-products?category-id=59&category=top-selling&search="},
            { name:'New Arrival',url:"/products/all-products?category-id=58&category=new-books&search="},
             {name:'Best books',url:"/products/all-products?category-id=57&category=best-books&search="}].map((item, index) => (
              <Link key={index} href={item.url} className="ml-4 w-full max-w-[150px] py-3 text-xs font-bold text-neutral-800 hover:underline" onClick={onCloseMenu}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
