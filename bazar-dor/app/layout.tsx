
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Hind_Siliguri } from "next/font/google";
import NavbarWithDate from "@/components/NavbarWithDate";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

import {
  getCategories,
  getProducts,
  type Category,
  type Product,
} from "@/lib/api";

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

  const [categoryResult, productResult] = await Promise.allSettled([
    getCategories(),
    getProducts(),
  ]);

  if (categoryResult.status === "fulfilled") {
    categories = categoryResult.value;
  } else {
    console.error("Category API failed:", categoryResult.reason);
  }

  if (productResult.status === "fulfilled") {
    products = productResult.value;
  } else {
    console.error("Product API failed:", productResult.reason);
  }

  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${hindSiliguri.variable} scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
        <NavbarWithDate categories={categories} />

        {products.length > 0 && <Ticker products={products} />}

        <main className="mx-auto w-full max-w-full flex-1 p-0">
          {children}
        </main>

        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
