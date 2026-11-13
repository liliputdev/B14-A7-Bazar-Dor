
import SortableProductGrid from "./SortableProductGrid";
import type { Product } from "./ProductCard";

export default function AllProductsSection({
  products,
}: {
  products: Product[];
}) {
  return (
    <section id="সব-পণ্য" className="space-y-4 pt-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
        <p className="text-xs text-gray-500 mt-1">
          মোট {products.length}টি পণ্যের হালনাগাদ তথ্য
        </p>
      </div>

      <SortableProductGrid products={products} />
    </section>
  );
}
