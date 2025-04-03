export const dynamic = "force-dynamic";

import React from "react";
import AnnouncementBar from "@/components/header/AnnouncementBar";
import { Hero } from "@/components/home/Hero";
import { Promotions } from "@/components/home/Promotions";
import MainLayout from "./MainLayout";
import ProductCarousel from "@/components/products/ProductCarousel";

function Index() {
  return (
    <div className="lato-normal ">
     
      <main>
        <MainLayout>
          <AnnouncementBar />
          <Hero />
          <div className="flex flex-col max-w-[1180px] mx-auto mt-20 gap-y-10">
            <ProductCarousel title="New Arrival" />
            <ProductCarousel title="Best Books" />
          </div>

          <Promotions />
        </MainLayout>
      </main>
    </div>
  );
}

export default Index;
