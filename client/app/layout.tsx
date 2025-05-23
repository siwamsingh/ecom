import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Dancing_Script } from "next/font/google";
import Script from "next/script";
import Head from "next/head";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clientUrl = process.env.NEXT_PUBLIC_BASE_URL;

// export const metadata: Metadata = {
//   title: { default: "Book4Value", template: "%s - Book4Value" },
//   description: "Get the best books at the most affordable price in India",
//   icons: {
//     icon: "/favicon.ico",
//   },
// }

export const metadata: Metadata = {
  title: {
    default: "Book4Value - Affordable and High-Quality Books in India",
    template: "%s | Book4Value",
  },
  description:
    "Buy high-quality books at the most affordable prices in India. From academic to competitive exam books, Book4Value is your trusted and fastest online bookstore.",
  keywords: [
    "Book4Value",
    "buy books online India",
    "affordable books",
    "UPSC books",
    "JEE books",
    "CBSE books",
    "cheap academic books",
    "online bookstore",
    "discount books",
    "exam preparation books",
  ],
  authors: [{ name: "Siwam Kumar Singh", url: `${clientUrl}` }],
  creator: "Siwam Kumar Singh",
  publisher: "Book4Value",
  metadataBase: new URL(`${clientUrl}`),
  alternates: {
    canonical: `${clientUrl}`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Book4Value - Affordable Books for Everyone",
    description:
      "Get the best books at the most affordable price in India with Book4Value.",
    creator: "@book4value",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-b.png",
  },
  category: "Books",
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1e293b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
        aria-label="Book4Value - Online Book Store"
      >
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}