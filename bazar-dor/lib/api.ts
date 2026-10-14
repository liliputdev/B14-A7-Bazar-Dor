const BASE_URL = 'https://openapi.programming-hero.com/api/bazardor';

export async function getProducts(category?: string) {
  const url = category
    ? `${BASE_URL}/products?category=${encodeURIComponent(category)}`
    : `${BASE_URL}/products`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.data || data;
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${BASE_URL}/products/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || data;
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.data || data;
}