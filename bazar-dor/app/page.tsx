import AllProductsSection from "@/components/AllProductsSection";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";

type Product = {
  id?: string | number;
  slug?: string;
  change?: number | string | null;
  [key: string]: any;
};

export default async function HomePage() {
  let products: Product[] = [];
  let hasError = false;

  try {
    const response: any = await getProducts();

    // Handle common API response formats safely
    if (Array.isArray(response)) {
      products = response;
    } else if (Array.isArray(response?.products)) {
      products = response.products;
    } else if (Array.isArray(response?.data)) {
      products = response.data;
    } else {
      console.error("Unexpected products API response:", response);
      hasError = true;
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
    hasError = true;
  }

  // Safely convert price changes to numbers
  const risers = products
    .filter((product) => Number(product.change) > 0)
    .slice(0, 6);

  const fallers = products
    .filter((product) => Number(product.change) < 0)
    .slice(0, 6);

  const today = new Date().toLocaleDateString("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f2f5f3] pb-16">
      <div className="mx-auto max-w-6xl space-y-12 px-4 pt-6">

        {/* Hero Banner */}
        <section className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:flex-row md:p-12">
          <div className="max-w-xl space-y-4">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {today}
            </span>

            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="text-sm leading-relaxed text-gray-500 md:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#সব-পণ্য"
              className="inline-block rounded-xl bg-[#0d8a43] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#0a7337]"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="relative flex aspect-square w-full max-w-[320px] items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-emerald-50" />
            <span
              className="z-10 select-none text-9xl"
              aria-hidden="true"
            >
              🧺
            </span>
          </div>
        </section>

        {/* Rising Prices */}
        {risers.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <span className="text-rose-600">▲</span>
              আজ দাম বেড়েছে
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {risers.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.slug ?? `riser-${index}`}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}

        {/* Falling Prices */}
        {fallers.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <span className="text-emerald-600">▼</span>
              আজ দাম কমেছে
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fallers.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.slug ?? `faller-${index}`}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section id="সব-পণ্য" className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              সব পণ্য
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              মোট {products.length}টি পণ্যের তথ্য
            </p>
          </div>

          {hasError ? (
            <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center">
              <p className="font-semibold text-gray-800">
                পণ্যের তথ্য লোড করা যায়নি
              </p>
              <p className="mt-2 text-sm text-gray-500">
                API সংযোগ ও সার্ভার টার্মিনালের error পরীক্ষা করুন।
              </p>
            </div>
          ) : products.length > 0 ? (
            <AllProductsSection products={products} />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="font-semibold text-gray-800">
                এখনো কোনো পণ্যের তথ্য পাওয়া যায়নি।
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
