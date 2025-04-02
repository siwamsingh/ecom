"use client"; // This component requires interactivity

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiHome, FiUser, FiShoppingBag, FiGrid } from "react-icons/fi";
import { MdOutlineDiscount } from "react-icons/md";
import CollectionsPage from "./CollectionsPage";

interface Props {
  collections: any;
}

interface BottomTab {
  title: string;
  key: string; // Unique key for tab management
  url: string;
  Icon: React.ElementType;
}

export const BottomNavigation = ({ collections }: Props) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  const bottomTabs: BottomTab[] = [
    { title: "Home", key: "home", url: "/", Icon: FiHome },
    { title: "Collections", key: "collections", url: "/collections", Icon: FiGrid },
    { title: "Cart", key: "cart", url: "/cart", Icon: FiShoppingBag },
    { title: "Discounts", key: "discounts", url: "/discounts", Icon: MdOutlineDiscount },
    { title: "Profile", key: "profile", url: "/user-profile", Icon: FiUser },
  ];

  const handleTabClick = (tab: BottomTab) => {
    if (tab.key === "collections") {
      setPreviousPage(window.location.pathname); // Save previous page
      setCurrentTab("collections");
    } else {
      router.push(tab.url);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white drop-shadow-[0_-15px_20px_rgba(0,0,0,0.10)] md:hidden">
        <ul className="flex h-full">
          {bottomTabs.map((tab) => (
            <li key={tab.key} className="flex-1">
              <button
                className={`flex h-full w-full flex-col items-center justify-center text-xs font-medium text-neutral-700 hover:text-violet-700`}
                onClick={() => handleTabClick(tab)}
              >
                <tab.Icon size={"1.2rem"} />
                <span className="mt-1">{tab.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {currentTab === "collections" && (
        <CollectionsPage
          collections={collections}
          onPageClose={() => {
            setCurrentTab(null);
            if (previousPage) {
              router.push(previousPage);
            }
          }}
        />
      )}
    </>
  );
};
