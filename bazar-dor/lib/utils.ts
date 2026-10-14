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
  
  return parseFloat(englishDigits.replace(/,/g, '')) || 0;
}

// C1 Sort implementation
export function sortProducts<T extends { price: number | string }>(
  products: T[],
  sortOption: 'default' | 'asc' | 'desc'
): T[] {
  if (sortOption === 'default') return products;

  return [...products].sort((a, b) => {
    const priceA = parseBengaliNumber(a.price);
    const priceB = parseBengaliNumber(b.price);
    
    return sortOption === 'asc' ? priceA - priceB : priceB - priceA;
  });
}