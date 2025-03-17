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
        console.log(error);

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
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <MainLayout>
      <Profile userData={userData} />
    </MainLayout>
  );
};

export default UserProfile;

//   const { id } = await params;

//   const cookieStore = await cookies();

//   const cookieHeader = cookieStore
//     .getAll()
//     .map(({ name, value }) => `${name}=${value}`)
//     .join("; ");

//   // await checkAuth(cookieHeader);

//   try {
//     const userData = await getUserApi(
//       {
//         user_id: Number(id),
//         user_phone_number: null,
//       },
//       cookieHeader
//     );

//     return (
//       <div>
//         <Profile userData={userData.user} />
//       </div>
//     );
//   } catch (error: any) {
//     console.error(
//       "Error during getting user data",
//       error?.response?.data?.message || error.message
//     );

//     return (
//       <div className="text-2xl h-screen font-bold flex justify-center items-center">
//         <div className="space-y-8">
//           <FaRegSadTear className="mx-auto" size={60} />
//           <div className="text-center max-w-xl">
//             Error loading user profile. Please try again later.
//           </div>
//         </div>
//       </div>
//     );
//   }
// };
