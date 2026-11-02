
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getProductsByCategory,
} from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let category;
  let products;

  try {
    [category, products] = await Promise.all([
      getCategory(slug),
      getProductsByCategory(slug),
    ]);
  } catch {
    notFound();
  }

  if (!category) {
    notFound();
  }

  const categoryName =
    category.nameBn ||
    category.name ||
    category.title ||
    "পণ্য";

  return (
    <main className="min-h-screen bg-[#f0f5f1]">
      <div className="mx-auto max-w-7xl px-4 py-6">

        {/* Breadcrumb */}
        <nav className="mb-5 flex gap-2 text-xs text-gray-500">
          <Link href="/">হোম</Link>
          <span>/</span>
          <span>{categoryName}</span>
        </nav>

        {/* Category header */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            {categoryName}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            এই ক্যাটাগরির সকল পণ্যের বাজার দর
          </p>

          <p className="mt-3 text-xs text-gray-400">
            মোট {products.length} টি পণ্য
          </p>
        </section>

        {/* Products */}
        <section className="mt-6">

          <h2 className="mb-4 text-base font-bold">
            সকল পণ্য
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {products.map((product, index) => {
                const productSlug =
                  product.slug ||
                  product.id ||
                  product._id;

                const productName =
                  product.nameBn ||
                  product.name ||
                  product.title ||
                  "পণ্য";

                const productPrice =
                  product.today ??
                  product.price ??
                  product.current_price;

                return (
                  <Link
                    key={product._id || product.id || index}
                    href={`/product/${productSlug}`}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f0f5f1]">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={productName}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span>🛒</span>
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="text-sm font-semibold text-gray-900">
                          {productName}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {product.unit || "কেজি"}
                        </p>

                        <p className="mt-2 text-sm font-bold text-green-700">
                          {productPrice !== undefined
                            ? `${productPrice} টাকা`
                            : "দাম পাওয়া যায়নি"}
                        </p>

                      </div>

                      <span className="text-gray-400">
                        →
                      </span>

                    </div>

                  </Link>
                );
              })}

            </div>
          ) : (
            <div className="rounded-xl bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
              </p>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
