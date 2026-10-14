import Link from 'next/link';

export interface Product {
  id: string | number;
  slug: string;
  name: string;
  unit: string;
  price: number | string;
  change: number; // Positive = up, Negative = down, 0 = neutral
  emoji: string;
}

export function ProductCard({ product }: { product: Product }) {
  const isUp = product.change > 0;
  const isDown = product.change < 0;

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
        {/* Top: Thumbnail & Title */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-xl shrink-0">
            {product.emoji || '🍚'}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm md:text-base leading-snug group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {product.unit || 'প্রতি কেজি'}
            </p>
          </div>
        </div>

        {/* Bottom: Price & Badge */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">আজকের দর</span>
            <span className="text-base md:text-lg font-bold text-gray-900">
              {product.price} টাকা
            </span>
          </div>

          <div
            className={`px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-0.5 ${
              isUp
                ? 'bg-rose-50 text-rose-600'
                : isDown
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span>{isUp ? '▲' : isDown ? '▼' : '—'}</span>
            <span>{Math.abs(product.change)}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}