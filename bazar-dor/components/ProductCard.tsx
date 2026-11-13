
import Link from "next/link";
import type { Product } from "@/lib/api";
import {
  UNIT_BN,
  arrow,
  formatPct,
  tickerColor,
  toBn,
} from "@/lib/format";

// Export Product so other components can import it.
export type { Product };

function getChangeValue(product: Product): number {
  const pct = Number(product.change?.pct ?? 0);
  const dir = String(product.change?.dir ?? "").toLowerCase();

  if (["down", "decrease", "negative", "fall"].includes(dir)) {
    return -Math.abs(pct);
  }

  if (["up", "increase", "positive", "rise"].includes(dir)) {
    return Math.abs(pct);
  }

  return 0;
}

export function getProductChange(product: Product): number {
  return getChangeValue(product);
}

export function ProductCard({ product }: { product: Product }) {
  const name =
    product.nameBn ||
    product.name ||
    product.title ||
    "পণ্যের নাম পাওয়া যায়নি";

  const slug = product.slug || String(product.id ?? product._id ?? "");
  const unitKey = String(product.unit ?? "").toLowerCase();
  const unit = UNIT_BN[unitKey as keyof typeof UNIT_BN] || product.unit || "কেজি";

  const percentage = Number(product.change?.pct ?? 0);

  const isUp = getChangeValue(product) > 0;
  const isDown = getChangeValue(product) < 0;

  const safeDirection: "flat" | "up" | "down" =
    isUp ? "up" : isDown ? "down" : "flat";

  return (
    <Link href={`/product/${slug}`} className="block group">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
            {product.image || "🛒"}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
              {name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              প্রতি {unit}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-xs text-gray-500">আজকের দর</span>

          <p className="text-xl font-bold text-gray-900 mt-1">
            {product.today != null ? toBn(product.today) : "—"} টাকা
          </p>

          <div
            className={`inline-flex items-center gap-1 mt-2 text-sm font-bold ${tickerColor(safeDirection)}`}
          >
            {arrow(safeDirection)} {formatPct(percentage)}
          </div>
        </div>
      </div>
    </Link>
  );
}
