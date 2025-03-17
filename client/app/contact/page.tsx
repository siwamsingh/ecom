import Image from "next/image";
import { Mail, Phone, MapPin, Info } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import MainLayout from "../MainLayout";

export default function Contact() {
  return (
    <MainLayout>
      <div className="lg:max-w-screen-lg mx-auto py-10 p-2 md:p-20 bg-slate-50 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Seller Image */}
        <div className="aspect-auto h-36 w-36 md:w-1/3 md:h-[80vh] relative rounded-full md:rounded-xl overflow-hidden border bg-white border-green-500">
          <Image
            src="/assets/seller.jpg"
            alt="Seller"
            layout="fill"
            objectFit="cover"
          />
        </div>

        {/* Contact Details */}
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl text-center sm:text-start font-bold text-gray-900">
            Contact Seller
          </h1>

          {/* Info Component */}
          <div className="bg-indigo-50 rounded-xl p-4 flex items-center">
            <Info className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
            <p className="text-sm text-indigo-900">
              Please contact us only for necessary inquiries such as missing
              orders, payment issues, bulk orders, or other serious concerns.
            </p>
          </div>

          <div className="space-y-4 text-base pl-4 sm:text-lg text-gray-700">
            <p className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-gray-500" />
              123 Main Street, City, Country
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-gray-500" />
              +1 234 567 890
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-gray-500" />
              seller@example.com
            </p>
          </div>

          {/* WhatsApp QR Section */}
          <div className="bg-green-100 p-6 rounded-lg flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-40 h-40">
              <Image
                src="/assets/whatsapp-qr.svg"
                alt="WhatsApp QR Code"
                layout="fill"
                objectFit="contain"
                className="rounded-lg border bg-white border-green-500"
              />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-xl sm:text-2xl font-semibold text-green-700 flex items-center gap-2">
                <FaWhatsapp className="w-7 h-7 text-green-600" /> WhatsApp
                Contact
              </h2>
              <p className="text-gray-700 text-sm sm:text-base mt-2">
                Scan the QR code to chat on WhatsApp.
              </p>
              <p className="text-lg font-medium text-gray-800 mt-1">
                +1 234 567 890
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
