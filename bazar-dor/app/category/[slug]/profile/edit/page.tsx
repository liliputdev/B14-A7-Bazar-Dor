import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import Footer from '@/components/Footer';

export default async function HomePage() {
  let products: any[] = [];

  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  // Products with increasing and decreasing prices
  const risers = products
    .filter((product) => product.change > 0)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change < 0)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f2f5f3] pb-16">
      <div className="mx-auto max-w-6xl space-y-12 px-4 pt-6">

        {/* Hero / Banner Section */}
        <section className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:flex-row md:p-12">
          <div className="max-w-xl space-y-4">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              বুধবার, ১৪ অক্টোবর, ২০২৬
            </span>

            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="text-sm leading-relaxed text-gray-500 md:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="pt-2">
              <a
                href="#সব-পণ্য"
                className="inline-block rounded-xl bg-[#0d8a43] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0a7337]"
              >
                সব পণ্য দেখুন
              </a>
            </div>
          </div>

          {/* Banner Graphic */}
          <div className="relative flex aspect-square w-full max-w-[320px] items-center justify-center">
            <div className="absolute z-0 h-64 w-64 rounded-full bg-emerald-50" />
            <span className="z-10 select-none text-9xl" aria-hidden="true">
              🧺
            </span>
          </div>
        </section>

        {/* Prices Increased */}
        {risers.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-rose-600">▲</span>
              <h2 className="text-xl font-bold text-gray-800">
                আজ দাম বেড়েছে
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {risers.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}

        {/* Prices Decreased */}
        {fallers.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-600">▼</span>
              <h2 className="text-xl font-bold text-gray-800">
                আজ দাম কমেছে
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {fallers.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section id="সব-পণ্য" className="space-y-4 pt-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              সব পণ্য
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              মোট {products.length}টি পণ্যের হালনাগাদ তথ্য
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <h3 className="font-semibold text-gray-800">
                পণ্যের তথ্য পাওয়া যায়নি
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                সার্ভার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}
        </section>

      </div>
       <Footer />
    </main>
  );
}
