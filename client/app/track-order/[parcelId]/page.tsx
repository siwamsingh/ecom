// app/track-order/[parcelId]/page.js
import MainLayout from "@/app/MainLayout";
import Link from "next/link";

type paramsType = Promise<{
  parcelId: string;
}>;

export default async function TrackOrderPage({
  params,
}: {
  params: paramsType;
}) {
  const { parcelId } = await params;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Parcel ID and Track Now Section */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Track Your Order
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start">
                    <span className="text-gray-600 mr-2">Parcel ID:</span>
                    <span className="font-medium text-lg">{parcelId}</span>
                  </div>
                </div>
                <a
                  href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Track Now
                </a>
              </div>
            </div>
          </div>

          {/* Tracking Instructions */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-2 sm:px-6 py-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
                How to Track Your Order on India Post
              </h2>

              {/* Step 1 */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    1
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Visit the India Post Tracking Portal
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 pl-11">
                  Click on the "Track Now" button above to open the official
                  India Post tracking portal in a new tab.
                </p>
                <div className="sm:pl-11 border-2 rounded-lg overflow-hidden">
                  <img
                    src="/assets/track-1.jpg"
                    alt="India Post Tracking Portal"
                    className="w-full object-cover"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    2
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Enter Your Tracking Number
                  </h3>
                </div>
                <div className="text-sm text-gray-600 mb-4 pl-11">
                  <p className="mb-2">
                    On the India Post website, enter your tracking number:
                  </p>
                  <p className="font-medium text-blue-700 bg-gray-100 p-2 rounded">
                    {parcelId}
                  </p>
                  <p className="text-sm mt-2">
                    You can copy this number and paste it into the tracking
                    field.
                  </p>
                </div>
                <div className="sm:pl-11 border-2 rounded-lg overflow-hidden">
                  <img
                    src="/assets/track-2.jpg"
                    alt="Enter Tracking Number"
                    className="w-full object-cover"
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    3
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    View Your Tracking Results
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 pl-11">
                  After submitting your tracking number, you'll see detailed
                  information about your parcel's current status, location, and
                  delivery progress. The tracking information is updated
                  regularly by India Post as your package moves through their
                  delivery network.
                </p>
                <div className="sm:pl-11 border-2 rounded-lg overflow-hidden">
                  <img
                    src="/assets/track-3.png"
                    alt="Tracking Results Page"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
