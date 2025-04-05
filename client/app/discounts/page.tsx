import CopyButton from "@/components/common/CopyButton";
import axios from "axios";
import { BadgePercent, Clock, Tag, Info, ExternalLink } from "lucide-react";
import MainLayout from "../MainLayout";
import { Metadata } from "next";
import ServerErrorPage from "@/components/Error/ServerError";

export interface Discount {
  coupon_code: string;
  description: string;
  discount_value: string;
  end_date: string;
  product_id: number;
  start_date: string;
  status: string;
  _id: number;
}

export interface Discounts {
  page: number;
  limit: number;
  maxPages: number;
  totalCount: number;
  discounts: Discount[];
}

const serverUrl = process.env.NEXT_SERVER_URL || "http://localhost:8000";


async function fetchDiscounts(): Promise<Discount[]> {
  try {

    const response = await axios.post<{ data: { discounts: Discount[] } }>(
      `${serverUrl}/discount/get-discounts`,
      {
        limit: 1000000000,
        expired: false,
        status: "active",
      }
    );
    return response.data.data.discounts;
  } catch {
    return [];
  }
}
export const metadata: Metadata = {
  title: "Discounts",
  description: "A list of all discounts available for the users",
};


export default async function DiscountsPage() {
  if(!serverUrl){
    return <ServerErrorPage/>
 }
  const discounts = await fetchDiscounts();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <BadgePercent size={20} className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Exclusive Discounts
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              View current promotional offers and save on your next purchase.
            </p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 flex items-center mb-6">
            <Info className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
            <p className="text-sm text-yellow-900">
              To use a coupon code, copy the link given for a product and apply
              it during order confirmation to get a discount on the{" "}
              <strong>product linked to the coupon</strong>.
            </p>
          </div>

          <div className="space-y-3">
            {discounts.length > 0 ? (
              discounts.map((discount) => (
                <div
                  key={discount._id}
                  className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-gray-800 flex items-center gap-1">
                        <Tag size={16} className="text-blue-600" />
                        {discount.coupon_code}
                      </h2>
                      <CopyButton couponCode={discount.coupon_code} />
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        discount.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {discount.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mt-2">
                    {discount.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4">
                      <p className="text-indigo-600 font-bold text-xs sm:text-base">
                        Save {discount.discount_value}%
                      </p>
                      <a
                        href={`/product?product-id=${discount.product_id}`}
                        className="inline-flex items-center font-medium text-blue-400 hover:text-blue-800 text-[9px] sm:text-xs  gap-1"
                      >
                        See Product <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="text-gray-500 text-[10px] sm:text-xs flex items-center gap-1">
                      <Clock size={12} />
                      Expires:{" "}
                      {new Date(discount.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500 text-sm">
                  No active promotions at this time. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>{" "}
    </MainLayout>
  );
}
