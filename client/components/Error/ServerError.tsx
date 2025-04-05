import Image from "next/image";
import Link from "next/link";

export default function ServerErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center">
        <Image
          src="/assets/server-error.webp"
          alt="Server Error"
          width={300}
          height={300}
          className="mx-auto"
        />
        <h1 className="text-6xl font-bold text-gray-800 mt-6">500</h1>
        <p className="text-lg text-gray-600 mt-2">
          Something went wrong on our end. Please try again later.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
