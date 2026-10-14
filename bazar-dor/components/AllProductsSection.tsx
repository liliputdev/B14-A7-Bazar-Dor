import { ProductCard, Product } from './ProductCard';

export default function AllProductsSection({ products }: { products: Product[] }) {
  return (
    <section id="সব-পণ্য" className="space-y-4 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
        <p className="text-xs text-gray-500 mt-1">
          মোট {products.length}টি পণ্যের হালনাগাদ তথ্য
        </p>
      </div>

      {/* Grid: 3 columns on large screens, collapsing to 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}