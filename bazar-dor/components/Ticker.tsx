import type { Product } from "@/lib/api";
import { UNIT_BN, arrow, formatPct, tickerColor, toBn } from "@/lib/format";

export default function Ticker({ products }: { products: Product[] }) {
  const items = [...products, ...products];

  return (
    <div className="overflow-hidden border-b border-gray-200 bg-white py-2.5" aria-label="দামের তালিকা">
      <div className="marquee-track">
        {items.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap border-r border-gray-200 px-5 text-sm"
          >
            <span>{p.image}</span>
            <span className="font-medium">{p.nameBn}</span>
            <span className="text-gray-600">
              {toBn(p.today)} টাকা/{UNIT_BN[p.unit]}
            </span>
            <span className={`font-bold ${tickerColor(p.change.dir)}`}>
              {arrow(p.change.dir)} {formatPct(p.change.pct)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}