// Convert English numbers to Bengali digits
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// Convert Bengali numbers back to English standard floats for sorting
export function parseBengaliNumber(bengaliNumStr: string | number): number {
  if (typeof bengaliNumStr === 'number') return bengaliNumStr;
  const englishDigits = bengaliNumStr
    .replace(/০/g, '0')
    .replace(/১/g, '1')
    .replace(/২/g, '2')
    .replace(/৩/g, '3')
    .replace(/৪/g, '4')
    .replace(/৫/g, '5')
    .replace(/৬/g, '6')
    .replace(/৭/g, '7')
    .replace(/৮/g, '8')
    .replace(/৯/g, '9');
  
  const parsed = parseFloat(englishDigits.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export type ProductSortOption = 'default' | 'asc' | 'desc';

type SortableProduct = {
  today?: number | string;
  price?: number | string;
  current_price?: number | string;
};

export function sortProducts<T extends SortableProduct>(
  products: T[],
  sortOption: ProductSortOption
): T[] {
  if (sortOption === 'default') return products;

  return [...products].sort((a, b) => {
    const rawPriceA = a.today ?? a.price ?? a.current_price;
    const rawPriceB = b.today ?? b.price ?? b.current_price;
    const priceA =
      rawPriceA === undefined ? Number.NaN : parseBengaliNumber(rawPriceA);
    const priceB =
      rawPriceB === undefined ? Number.NaN : parseBengaliNumber(rawPriceB);
    const hasPriceA = Number.isFinite(priceA);
    const hasPriceB = Number.isFinite(priceB);

    if (!hasPriceA || !hasPriceB) {
      if (hasPriceA === hasPriceB) return 0;
      return hasPriceA ? -1 : 1;
    }

    return sortOption === 'asc' ? priceA - priceB : priceB - priceA;
  });
}