import { notFound } from "next/navigation";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
};

type Market = {
  market?: string;
  division?: string;
  min?: number | string;
  max?: number | string;
};

type Product = {
  id?: string | number;
  _id?: string;
  slug?: string;
  nameBn?: string;
  name?: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  image?: string;
  today?: number | string;
  yesterday?: number | string;
  change?: {
    dir?: "up" | "down" | "same";
    pct?: number | string;
  };
  markets?: Market[];
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

async function fetchJSON(url: string) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = await response.json();

  if (payload?.success === false || payload?.status === false) {
    throw new Error(payload?.message || "API request failed");
  }

  return payload;
}

function unwrapArray(payload: any): any[] {
  let value = payload;

  for (let i = 0; i < 6; i++) {
    if (Array.isArray(value)) return value;

    if (!value || typeof value !== "object") return [];

    value =
      value.products ??
      value.items ??
      value.results ??
      value.data ??
      value.result;
  }

  return Array.isArray(value) ? value : [];
}

function unwrapProduct(payload: any): Product | null {
  let value = payload;

  for (let i = 0; i < 6; i++) {
    if (!value || typeof value !== "object") return null;

    if (Array.isArray(value)) {
      value = value[0];
      continue;
    }

    if (
      value.slug !== undefined ||
      value.nameBn !== undefined ||
      value.today !== undefined
    ) {
      return value as Product;
    }

    value =
      value.product ??
      value.item ??
      value.data ??
      value.result;
  }

  return null;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  // First find the product in the products list.
  const listPayload = await fetchJSON(`${API_URL}/products`);
  const products = unwrapArray(listPayload);

  const matched = products.find((item: any) => {
    const itemSlug = String(item?.slug ?? "").toLowerCase();
    const itemId = String(item?.id ?? item?._id ?? "").toLowerCase();

    return itemSlug === slug.toLowerCase() ||
      itemId === slug.toLowerCase();
  });

  if (!matched) return null;

  const id = matched.id ?? matched._id;

  // Try the individual product endpoint for complete details.
  if (id !== undefined && id !== null) {
    try {
      const detailPayload = await fetchJSON(
        `${API_URL}/products/${encodeURIComponent(String(id))}`
      );

      const detail = unwrapProduct(detailPayload);

      if (detail) {
        return { ...matched, ...detail };
      }
    } catch (error) {
      console.error("Product detail endpoint failed:", error);
    }
  }

  // Use the list record if the detail endpoint is unavailable.
  return matched as Product;
}

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function bnNumber(value: number | undefined, digits = 0) {
  return value === undefined
    ? "—"
    : value.toLocaleString("bn-BD", {
        maximumFractionDigits: digits,
      });
}

function bnPrice(value: number | undefined) {
  return value === undefined
    ? "—"
    : `${bnNumber(value)} টাকা`;
}

function getUnit(unit?: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    piece: "টি",
    pcs: "টি",
    dozen: "ডজন",
  };

  return units[unit?.toLowerCase() || ""] || unit || "কেজি";
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product: Product | null;

  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error("Product API error:", error);
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  if (!product) notFound();

  const markets = Array.isArray(product.markets)
    ? product.markets
    : [];

  const today = toNumber(product.today);
  const yesterday = toNumber(product.yesterday);

  const difference =
    today !== undefined && yesterday !== undefined
      ? today - yesterday
      : undefined;

  const isUp =
    product.change?.dir === "up" ||
    (product.change?.dir !== "down" &&
      difference !== undefined &&
      difference > 0);

  const isDown =
    product.change?.dir === "down" ||
    (product.change?.dir !== "up" &&
      difference !== undefined &&
      difference < 0);

  const changeColor = isUp
    ? "text-red-500"
    : isDown
      ? "text-green-600"
      : "text-gray-500";

  const percentage = toNumber(product.change?.pct);
  const unit = getUnit(product.unit);

  // Normalize market prices.
  const marketStats = markets.map((market) => {
    const min = toNumber(market.min);
    const max = toNumber(market.max);

    // This is an estimated midpoint, not an API-reported average.
    const average =
      min !== undefined && max !== undefined
        ? (min + max) / 2
        : undefined;

    return {
      ...market,
      min,
      max,
      average,
    };
  });

  const validMinimums = marketStats
    .map((market) => market.min)
    .filter((value): value is number => value !== undefined);

  const validMaximums = marketStats
    .map((market) => market.max)
    .filter((value): value is number => value !== undefined);

  const validAverages = marketStats
    .map((market) => market.average)
    .filter((value): value is number => value !== undefined);

  const minimum =
    validMinimums.length > 0
      ? Math.min(...validMinimums)
      : undefined;

  const maximum =
    validMaximums.length > 0
      ? Math.max(...validMaximums)
      : undefined;

  const average =
    validAverages.length > 0
      ? validAverages.reduce((sum, value) => sum + value, 0) /
        validAverages.length
      : undefined;

  const lowestMarket = marketStats.find(
    (market) => market.min === minimum
  );

  const highestMarket = marketStats.find(
    (market) => market.max === maximum
  );

  return (
    <main className="min-h-screen bg-[#f1f6f2] text-[#26332c]">
  <div className="mx-auto max-w-6xl space-y-12 px-4 pt-6 pb-10">

        {/* Breadcrumb */}
        <nav className="mb-[26px] flex min-h-[30px] items-center gap-3 px-2 text-sm text-gray-500">
          <a href="/" className="hover:text-green-700">
            হোম
          </a>
          <span className="text-lg">›</span>
          <span>{product.categoryNameBn || "পণ্য"}</span>
          <span className="text-lg">›</span>
          <span className="text-gray-700">
            {product.nameBn || product.name || "পণ্য"}
          </span>
        </nav>

        {/* Product Header */}
        <section className="mb-[27px] flex min-h-[198px] items-center justify-between gap-5 rounded-[18px] border border-[#dfe8e1] bg-white/70 px-[23px] py-[22px] max-sm:flex-wrap max-sm:p-4">

          <div className="flex min-w-0 items-center gap-[18px] max-sm:gap-3">
            <div className="flex h-[91px] w-[91px] shrink-0 items-center justify-center rounded-[20px] bg-[#f1f6f2] text-[38px] max-sm:h-[62px] max-sm:w-[62px] max-sm:text-[29px]">
              {product.image || product.categoryIcon || "🌾"}
            </div>

            <div className="min-w-0">
              <h1 className="text-[34px] font-bold leading-[1.35] tracking-tight text-[#202b24] max-sm:text-[22px]">
                {product.nameBn || product.name || "পণ্য"}
              </h1>

              <p className="text-[15px] text-gray-500 max-sm:text-xs">
                প্রতি {unit} · {product.categoryNameBn || "পণ্য"}
              </p>

              <p className="mt-[9px] text-sm text-[#26332c] max-sm:text-xs">
                গতকালের তুলনায় আজ দাম{" "}
                <strong>
                  {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত"}
                </strong>
                {difference !== undefined && (
                  <> · {bnNumber(Math.abs(difference))} টাকা</>
                )}
              </p>
            </div>
          </div>

          {/* Today's Price */}
          <aside className="flex min-h-[151px] w-[134px] shrink-0 flex-col items-center justify-center rounded-[18px] bg-[#f1f6f2] px-2 py-3 text-center max-sm:min-h-[112px] max-sm:w-[100px]">
            <p className="text-sm text-gray-500 max-sm:text-[11px]">
              আজকের দাম
            </p>

            <p className="text-[32px] font-extrabold leading-tight text-[#202b24] max-sm:text-[25px]">
              {bnNumber(today)}
            </p>

            <p className="text-[15px] text-gray-500 max-sm:text-[11px]">
              টাকা / {unit}
            </p>

            {percentage !== undefined && (
              <p className={`mt-[5px] text-sm font-bold ${changeColor} max-sm:text-[11px]`}>
                {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                {bnNumber(percentage, 1)}%
              </p>
            )}
          </aside>
        </section>

        {/* Price Summary */}
        <section className="rounded-[18px] border border-[#dfe8e1] bg-white/70 px-[23px] py-6 max-sm:px-[14px]">
          <h2 className="mb-[15px] text-[19px] font-bold">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-[13px] sm:grid-cols-3">

            <SummaryCard
              label="সর্বনিম্ন দাম"
              value={bnNumber(minimum)}
              description={
                lowestMarket?.market || "সবচেয়ে কম দামের বাজার"
              }
              color="text-[#159b53]"
            />

            <SummaryCard
              label="সর্বাধিক দাম"
              value={bnNumber(maximum)}
              description={
                highestMarket?.market || "সবচেয়ে বেশি দামের বাজার"
              }
              color="text-red-500"
            />

            <SummaryCard
              label="গড় দাম"
              value={bnNumber(average, 1)}
              description={`প্রতি ${unit}-এর আনুমানিক হিসাব`}
              color="text-[#159b53]"
            />
          </div>

          {/* Market-wise Prices */}
          <h2 className="mb-[14px] mt-7 text-[19px] font-bold">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-x-auto rounded-[19px] border border-[#dfe8e1]">
            <table className="w-full min-w-[690px] border-collapse text-left text-sm">
              <thead className="bg-[#f7faf7] text-gray-500">
                <tr>
                  <th className="whitespace-nowrap px-[18px] py-4 font-bold">
                    বাজার
                  </th>
                  <th className="whitespace-nowrap px-[18px] py-4 font-bold">
                    বিভাগ
                  </th>
                  <th className="whitespace-nowrap px-[18px] py-4 font-bold">
                    সর্বনিম্ন
                  </th>
                  <th className="whitespace-nowrap px-[18px] py-4 font-bold">
                    গড় দাম
                  </th>
                  <th className="whitespace-nowrap px-[18px] py-4 text-right font-bold">
                    সর্বাধিক
                  </th>
                </tr>
              </thead>

              <tbody>
                {marketStats.length > 0 ? (
                  marketStats.map((market, index) => (
                    <tr
                      key={`${market.market || "market"}-${index}`}
                      className="border-t border-[#dfe8e1] odd:bg-white even:bg-[#f1f6f2]"
                    >
                      <td className="px-[18px] py-4 font-medium">
                        {market.market || "—"}
                      </td>

                      <td className="px-[18px] py-4">
                        {market.division || "—"}
                      </td>

                      <td className="px-[18px] py-4 text-green-700">
                        {bnPrice(market.min)}
                      </td>

                      <td className="px-[18px] py-4">
                        {bnPrice(market.average)}
                      </td>

                      <td className="px-[18px] py-4 text-right font-medium text-red-500">
                        {bnPrice(market.max)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <article className="flex min-h-[116px] flex-col justify-center rounded-[19px] border border-[#dfe8e1] px-[27px] py-[17px] max-sm:min-h-[94px] max-sm:px-[18px]">
      <p className="text-[13px] text-[#26332c]">
        {label}
      </p>

      <p className={`mt-[1px] text-[23px] font-extrabold leading-[1.45] ${color}`}>
        {value} <span className="text-[17px] font-medium">টাকা</span>
      </p>

      <p className="mt-[2px] text-xs text-[#26332c]">
        {description}
      </p>
    </article>
  );
}
