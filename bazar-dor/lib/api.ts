
const API_BASE_URL =
  "https://openapi.programming-hero.com/api/bazardor";

export type Product = {
  id?: string | number;
  _id?: string;
  slug?: string;
  name?: string;
  nameBn?: string;
  title?: string;
  image?: string;
  category?: string;
  category_name?: string;
  unit?: string;
  today?: number | string;
  change?: {
    dir: string;
    pct: number | string;
  };
  [key: string]: any;
};

export type Category = {
  id?: string | number;
  _id?: string;
  slug?: string;
  name?: string;
  nameBn?: string;
  title?: string;
  icon?: string;
  [key: string]: any;
};

async function apiRequest(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result?.success === false || result?.status === false) {
    throw new Error(result?.message || "API request failed");
  }

  return result;
}

function unwrap(data: any): any {
  let result = data;

  for (let i = 0; i < 5; i++) {
    if (result?.data !== undefined) {
      result = result.data;
    } else if (result?.result !== undefined) {
      result = result.result;
    } else {
      break;
    }
  }

  return result;
}

function extractArray(data: any, keys: string[]) {
  const result = unwrap(data);

  if (Array.isArray(result)) return result;

  for (const key of keys) {
    if (Array.isArray(result?.[key])) {
      return result[key];
    }
  }

  return [];
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const data = await apiRequest("/products");

  return extractArray(data, ["products", "items", "results"]);
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const data = await apiRequest("/categories");

  return extractArray(data, ["categories", "items", "results"]);
}

// Get products by category
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const data = await apiRequest(
    `/products?category=${encodeURIComponent(category)}`
  );

  return extractArray(data, ["products", "items", "results"]);
}

// Get a single product by slug or ID
export async function getProduct(
  slugOrId: string
): Promise<Product | null> {
  try {
    // First search the products list by slug or ID.
    const products = await getProducts();

    const matchedProduct = products.find((product) => {
      const slug = String(product.slug ?? "").toLowerCase();
      const id = String(product.id ?? product._id ?? "").toLowerCase();
      const searchValue = slugOrId.toLowerCase();

      return slug === searchValue || id === searchValue;
    });

    if (matchedProduct) {
      return matchedProduct;
    }

    // Fallback: Try the individual product endpoint.
    const data = await apiRequest(
      `/products/${encodeURIComponent(slugOrId)}`
    );

    const result = unwrap(data);

    if (Array.isArray(result)) {
      return result[0] ?? null;
    }

    return result?.product ?? result?.item ?? result ?? null;
  } catch (error) {
    console.error("Product API request failed:", error);
    return null;
  }
}

// Get a single category by slug
export async function getCategory(
  slug: string
): Promise<Category | null> {
  try {
    const data = await apiRequest(
      `/categories/${encodeURIComponent(slug)}`
    );

    const result = unwrap(data);

    if (Array.isArray(result)) {
      return result[0] ?? null;
    }

    return result?.category ?? result ?? null;
  } catch (error) {
    console.error("Category API request failed:", error);
    return null;
  }
}
