
import type { Product } from "@/lib/api";
import { UNIT_BN, arrow, formatPct, tickerColor, toBn } from "@/lib/format";

export default function Ticker({ products }: { products: Product[] }) {
  // Double the list for seamless infinite scroll; prefix keys with copy index
  const items = [
    ...products.map((p, i) => ({ ...p, _tickerKey: `a-${i}` })),
    ...products.map((p, i) => ({ ...p, _tickerKey: `b-${i}` })),
  ];

  return (
    <div
      className="overflow-hidden border-b border-gray-200 bg-white py-2.5"
      aria-label="দামের তালিকা"
    >
      <div className="marquee-track">
        {items.map((p) => {
          const unitKey = String(p.unit ?? "").toLowerCase();
          const unit =
            UNIT_BN[unitKey as keyof typeof UNIT_BN] || p.unit || "কেজি";

          const direction = String(p.change?.dir ?? "").toLowerCase();
          const pct = Number(p.change?.pct ?? 0);

          const safeDirection: "flat" | "up" | "down" =
            ["up", "increase", "positive", "rise"].includes(direction)
              ? "up"
              : ["down", "decrease", "negative", "fall"].includes(direction)
                ? "down"
                : "flat";

          return (
            <div
              key={p._tickerKey}
              className="flex items-center gap-2 whitespace-nowrap border-r border-gray-200 px-5 text-sm"
            >
              <span>{p.image || "🛒"}</span>
              <span className="font-medium">{p.nameBn || p.name || p.title || "পণ্য"}</span>

              <span className="text-gray-600">
                {p.today != null ? toBn(p.today) : "—"} টাকা/{unit}
              </span>

              <span className={`font-bold ${tickerColor(safeDirection)}`}>
                {arrow(safeDirection)} {formatPct(pct)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
