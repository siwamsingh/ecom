"use client";
import React, { useState , Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Dialog, Transition } from "@headlessui/react";
import {
  User,
  Phone,
  Shield,
  UserCircle,
  Calendar,
  ShoppingCart,
  Package,
  MapPin,
  History,
  LogIn,
  LogOut,
} from "lucide-react";

interface UserData {
  _id: number;
  username: string;
  phone_number: string;
  status: string;
  role: string;
  last_login_time: string;
  login_attempt: string;
  created_at: string;
}

// Function to format date and time
const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

function Profile({ userData }: { userData: UserData }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        // Set baseURL to ensure we're using an absolute path
        baseURL: window.location.origin
      });
      toast.success("User logged out.")
      router.push('/auth/login');
    } catch (error) {
      console.error("Error logging out:", error);
      // Still redirect to login page even if there's an error
      router.push('/auth/login');
    }
  };
  return (
    <div className="sm:py-16 bg-gray-50 p-4 md:p-8">
      <div className="max-w-screen-lg  mx-auto space-y-8">

        {/* Profile Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex items-start gap-4  sm:items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Left Section - Profile Icon & Username */}
            <div className=" w-1/3 text-center pt-10 sm:pt-0 md:text-left flex flex-col items-center justify-center">
              <div className="bg-gray-100 h-16 w-16  sm:w-24 sm:h-24 flex items-center justify-center rounded-full mx-auto md:mx-0">
                <UserCircle className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-base md:text-2xl font-semibold text-gray-900 mt-4">
                {userData.username}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">{userData.role}</p>
            </div>

            {/* Right Section - Profile Details */}
            <div className="w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* User ID */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-900">{userData._id}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {userData.phone_number}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium text-gray-900">{userData.role}</p>
                </div>
              </div>

              {/* Last Login */}
              <div className="flex items-center space-x-3">
                <LogIn className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(userData.last_login_time)}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(userData.created_at)}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-700">{userData.status}</p>
                </div>
              </div>

            </div>
          </div>
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10 sm:mt-20 mx-auto">
            <Link
              href="/cart"
              className="bg-transparent py-4 sm:py-6 text-xs sm:text-base text-center border-2 border-gray-200 flex flex-col items-center justify-center hover:border-gray-400 rounded-lg"
            >
              <ShoppingCart className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-black">My Cart</span>
            </Link>

            <Link
              href="/orders"
              className="bg-transparent py-4 sm:py-6 text-xs sm:text-base text-center border-2 border-gray-200 flex flex-col items-center justify-center hover:border-gray-400 rounded-lg"
            >
              <Package className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-black">My Orders</span>
            </Link>

            <Link
              href="/addresses"
              className="bg-transparent py-4 sm:py-6 text-xs sm:text-base text-center border-2 border-gray-200 flex flex-col items-center justify-center hover:border-gray-400 rounded-lg"
            >
              <MapPin className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-black">My Addresses</span>
            </Link>

            <Link
              href="/order-history"
              className="bg-transparent py-4 sm:py-6 text-xs sm:text-base text-center border-2 border-gray-200 flex flex-col items-center justify-center hover:border-gray-400 rounded-lg"
            >
              <History className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-black">Order History</span>
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-transparent py-4 sm:py-6 text-xs sm:text-base text-center border-2 border-gray-200 flex flex-col items-center justify-center hover:border-red-400 hover:text-red-500 rounded-lg"
            >
              <LogOut className="w-8 h-8 text-red-500" />
              <span className="text-sm text-black">Logout</span>
            </button>
          </div>
        </div>
      </div>
       {/* Logout Confirmation Dialog */}
       <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold">Confirm Logout</Dialog.Title>
              <p className="text-sm text-gray-600 mt-2">Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="px-4 py-2 text-gray-600" onClick={() => setIsOpen(false)}>Cancel</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={handleLogout}>Logout</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Profile;
