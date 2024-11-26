import React from "react";
import SEO from "../components/SEO";
import TopCarsoul from "@/components/Carsoul/TopCarsoul";

function index() {
  return (
    <div className="lato-normal">
      <SEO
        title="Buy Best Books Online At Affordable Prices."
        description="Shop the best-selling books online at affordable prices. Huge collection of books for children and adults."
      />
      <main>
        <TopCarsoul/>
        
      </main>
    </div>
  );
}

export default index;
