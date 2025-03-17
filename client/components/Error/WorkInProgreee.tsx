import { Wrench, Hourglass } from "lucide-react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function WorkInProgressPage() {
  return (
    <div className="min-h-fir py-20 flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="border-slate-200 border bg-white rounded-2xl p-8 text-center">
        <div className="flex justify-center text-blue-500">
          <Wrench size={50} />
        </div>
        <h1 className="text-xl sm:text-3xl font-bold mt-4">🚧 Work in Progress 🚧</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-lg">
          We're currently working hard on our app and will launch it as soon as possible! 🚀
        </p>
        <p className="mt-2 text-gray-500">Thank you for your patience and support! ❤️</p>
        <div className="mt-4 flex justify-center">
          <Hourglass size={40} className="text-yellow-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
