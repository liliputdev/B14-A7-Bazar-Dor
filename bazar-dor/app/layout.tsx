import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Hind_Siliguri } from "next/font/google";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";


import {
  getCategories,
  getProducts,
  type Category,
  type Product,
} from "@/lib/api";
import { banglaDate } from "@/lib/format";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  let products: Product[] = [];
  let error = "";

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);
  } catch (e) {
    error = String(e);
  }

  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${hindSiliguri.variable} scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
        <Navbar categories={categories} date={banglaDate()} />

        {error ? (
          <div className="bg-red-100 p-3 text-center text-red-700">
            Data could not load: {error}
          </div>
        ) : (
          <Ticker products={products} />
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 px-4">
  {children}
</main>

<Footer />

        <Toaster position="top-right" />
      </body>
    </html>
  );
}