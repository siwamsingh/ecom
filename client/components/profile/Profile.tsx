"use client";
import React, { useState, Fragment } from "react";
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
    } catch  {
      router.push('/auth/login');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#232323] sm:bg-slate-100 px-3 sm:px-6 py-8">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center ">
                <div className="bg-[#2c2c2c] sm:bg-white p-2 rounded-full shadow-md">
                  <UserCircle className="w-8 h-8 sm:w-16 sm:h-16 sm:text-black text-white " />
                </div>
                <div className="ml-4 sm:text-black text-white ">
                  <h1 className="text-xl sm:text-2xl font-bold sm:text-black text-white">{userData.username}</h1>
                  <div className="flex items-center mt-1">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="">{userData.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#181818] text-white text-xs sm:text-sm">
                  <span className={`mr-2 h-2 w-2 rounded-full ${userData.status === "active" ? "bg-green-400" : "bg-gray-400"}`}></span>
                  {userData.status}
                </span>
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div className="px-6 py-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User ID */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">User ID</p>
                  <p className="font-medium text-gray-900">{userData._id}</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Phone Number</p>
                  <p className="font-medium text-gray-900">{userData.phone_number}</p>
                </div>
              </div>

              {/* Last Login */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <LogIn className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Last Login</p>
                  <p className="font-medium text-gray-900">{formatDateTime(userData.last_login_time)}</p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Member Since</p>
                  <p className="font-medium text-gray-900">{formatDateTime(userData.created_at)}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase">Role</p>
                  <p className="font-medium text-gray-900">{userData.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="px-6 py-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <a
                href="/cart"
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
              >
                <ShoppingCart className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">My Cart</span>
              </a>

              <a
                href="/order/my-orders"
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
              >
                <Package className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">My Orders</span>
              </a>

              <a
                href="/address/my-addresses"
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
              >
                <MapPin className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">My Addresses</span>
              </a>

              <a
                href="/order/history"
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
              >
                <History className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Order History</span>
              </a>
              
              <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
              >
                <LogOut className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Logout</span>
              </button>
            </div>
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
            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <Dialog.Title className="text-xl font-semibold text-gray-900">Confirm Logout</Dialog.Title>
              <p className="mt-3 text-gray-600">Are you sure you want to log out of your account?</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Profile;