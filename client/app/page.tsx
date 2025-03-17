import React from "react";
import SEO from "../components/common/SEO";
import Footer from "../components/footer/Footer";
import { Header } from "@/components/header/Header";
import { NavLink } from "../components/header/Header";
import { Collections } from "../components/types";
import AnnouncementBar from "@/components/header/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { Promotions } from "@/components/home/Promotions";
import StoreProvider from "./StoreProvider";
import MainLayout from "./MainLayout";

function Index() {
  const dummyCollections: Collections = [
    {
      id: "1",
      name: "T-Shirts",
      slug: "t-shirts",
      children: [
        {
          id: "11",
          name: "Graphic Tees",
          slug: "graphic-tees",
          types: ["men", "women"],
        },
        {
          id: "12",
          name: "Plain Tees",
          slug: "plain-tees",
          types: ["men", "women", "kids"],
        },
      ],
    },
    {
      id: "2",
      name: "Shoes",
      slug: "shoes",
      children: [
        {
          id: "21",
          name: "Sneakers",
          slug: "sneakers",
          types: ["men", "women", "kids"],
        },
        { id: "22", name: "Boots", slug: "boots", types: ["men", "women"] },
      ],
    },
    {
      id: "3",
      name: "Accessories",
      slug: "accessories",
      children: [
        {
          id: "31",
          name: "Hats",
          slug: "hats",
          types: ["men", "women", "kids"],
        },
        { id: "32", name: "Bags", slug: "bags", types: ["women"] },
      ],
    },
  ];

  return (
    <div className="lato-normal ">
      <SEO
        title="Buy Best Books Online At Affordable Prices."
        description="Shop the best-selling books online at affordable prices. Huge collection of books for children and adults."
      />
      <main>
          <MainLayout>
            <AnnouncementBar />
            <Hero />
            <Promotions />
          </MainLayout>
      </main>
    </div>
  );
}

export default Index;
