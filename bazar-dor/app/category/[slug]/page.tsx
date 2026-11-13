
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getProductsByCategory,
} from "@/lib/api";
import SortableProductGrid from "@/components/SortableProductGrid";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [categoryResult, productsResult] = await Promise.allSettled([
    getCategory(slug),
    getProductsByCategory(slug),
  ]);

  if (categoryResult.status === "rejected" || !categoryResult.value) {
    notFound();
  }

  const category = categoryResult.value;
  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];

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
            <SortableProductGrid products={products} />
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
