import WorkInProgressPage from "@/components/Error/WorkInProgreee";
import React from "react";
import MainLayout from "../MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download App",
  description: "Link to our app - work in progress",
};

const page = () => {
  return (
    <div>
      <MainLayout>
        <WorkInProgressPage />
      </MainLayout>
    </div>
  );
};

export default page;
