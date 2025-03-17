'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, forwardRef } from 'react';
import { Transition } from '@headlessui/react';
import { IconType } from 'react-icons';
import { FiUser, FiShoppingBag } from 'react-icons/fi';
import { RiDiscountPercentLine } from "react-icons/ri";

import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { buildCategoryTree } from '@/utils/buildCategoryTree';
import { TopBar } from './TopBar';

// Types
export interface NavLink {
  name: 'educational' | 'fiction' | 'top selling' | 'new' | 'discounts' | 'contacts';
  href: string;
  collapsible?: boolean;
}

export const navLinks: NavLink[] = [
  { name: 'educational', href: '/products/all-products?category_id=34&category=educational&search=', collapsible: true },
  { name: 'fiction', href: '/products/all-products?category_id=43&category=fiction&search=', collapsible: true },
  { name: 'top selling', href: '/products/all-products?category_id=59&category=top-selling&search=' , collapsible: true},
  { name: 'new', href: '/products/all-products?category_id=58&category=new-books&search=' , collapsible: true},
  { name: 'discounts', href: '/discounts', collapsible: true },
];

export const sideNavLinks: [string, IconType][] = [
  ['/discounts', RiDiscountPercentLine],
  ['/cart', FiShoppingBag],
  ['/user-profile', FiUser],
];

// Dynamically import components that use client-side features
const DynamicSearch = dynamic(() => import('./Search').then(mod => mod.Search), {
  ssr: false
});

const DynamicMegaMenu = dynamic(() => import('./MegaMenu').then(mod => mod.MegaMenu), {
  ssr: false
});

const DynamicBottomNavigation = dynamic(
  () => import('../bottom-navigation/BottomNavigation').then(mod => mod.BottomNavigation),
  { ssr: false }
);

export const Header = forwardRef<HTMLDivElement>(({}, ref) => {
  const [mounted, setMounted] = useState(true);
  const [hoveredNavLink, setHoveredNavLink] = useState<NavLink | null>();

  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );

  // Build the category tree directly in the Header component
  const collections = categories.length ? buildCategoryTree(categories) : [];
  
  const handleShowMenu = (navLink: NavLink) => setHoveredNavLink(navLink);
  const handleCloseMenu = () => setHoveredNavLink(null);

  return (
    <header>
      <TopBar/>
      <div className="relative h-14 bg-white shadow-md shadow-gray-200">
        <div className="mx-auto flex h-full items-center px-4 xl:container">
          <div className="mr-5 flex shrink-0 items-center">
            <Link href="/">
              <Image
                priority
                src="/logo-b.png"
                alt="logo"
                width={100}
                height={35}
                quality={100}
              />
            </Link>
          </div>
          <ul className="ml-auto hidden h-full md:flex">
            {navLinks.map((item, index) => (
              <li
                className={`font-medium text-neutral-700 transition-colors ${
                  hoveredNavLink === item && 'bg-violet-100 text-violet-700'
                }`}
                key={index}
                onMouseEnter={() => handleShowMenu(item)}
                onMouseLeave={handleCloseMenu}
              >
                <Link href={item.href} className="flex h-full items-center text-sm  lg:text-base px-3 lg:px-5" onClick={handleCloseMenu}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="ml-auto items-center md:flex">
            {mounted && <DynamicSearch onSearch={value => console.log(value)} />}
            {sideNavLinks.map(([url, Icon]) => (
              <Link key={url} href={url} className="ml-5 hidden md:block">
                <Icon className="text-neutral-700 transition-colors hover:text-violet-700" size="20px" />
              </Link>
            ))}
            <button className="ml-5 hidden rounded-full border border-solid border-violet-700 p-[2px] md:block">
              <Image
                src="/logo-b.png"
                alt="user profile image"
                width={30}
                height={30}
                className="overflow-hidden rounded-full"
                quality={100}
              />
            </button>
          </ul>
        </div>
        {mounted && hoveredNavLink?.collapsible && (
          <Transition
            show={Boolean(hoveredNavLink?.collapsible)}
            as="div"
            ref={ref}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DynamicMegaMenu
              collections={collections}
              onShowMenu={() => handleShowMenu(hoveredNavLink)}
              onCloseMenu={handleCloseMenu}
            />
          </Transition>
        )}
      </div>
      {mounted && (
        <DynamicBottomNavigation navLinks={navLinks} collections={[]} />
      )} 
    </header>
  );
});

Header.displayName = 'Header';