"use client";

import { useEffect, useState } from "react";
import Profile from "@/components/profile/Profile";
import { FaRegSadTear } from "react-icons/fa";
import toast from "react-hot-toast";
import MainLayout from "../MainLayout";

const UserProfile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  let fetchOnce = true;

  useEffect(() => {
    if (!fetchOnce) return;
    fetchOnce = false;
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/get_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({}),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          if (response.status === 577) {
            toast.error("Session Expired Login to Continue.");
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 3000);
          }

          if (response.status === 477 ) {
            toast.error("Login to Continue.");
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 3000);
          }

          throw new Error(result.message || "Failed to fetch user data.");
        }


        setUserData(result.data.user);
      } catch (error: any) {

        if (error.status === 577) {
          toast.error("Session Expired Login to Continue.");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 3000);
        }

        if (error.status === 477) {
          toast.error("Login to Continue.");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 3000);
        }


        setError("Login To Continue");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return (
      <div className="text-2xl h-screen font-bold flex justify-center items-center">
        <div className="space-y-8">
          <FaRegSadTear className="mx-auto" size={60} />
          <div className="text-center max-w-xl">{error}</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
  }

  return (
    <MainLayout>
      <Profile userData={userData} />
    </MainLayout>
  );
};

export default UserProfile;

