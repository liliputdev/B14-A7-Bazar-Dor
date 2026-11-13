
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
  categoryNameBn?: string;
  categoryIcon?: string;
  category_name?: string;
  unit?: string;
  today?: number | string;
  yesterday?: number | string;
  price?: number | string;
  current_price?: number | string;
  change?: {
    dir?: string;
    pct?: number | string;
  };
  markets?: Market[];
};

export type Market = {
  market?: string;
  division?: string;
  min?: number | string;
  max?: number | string;
};

export type Category = {
  id?: string | number;
  _id?: string;
  slug?: string;
  name?: string;
  nameBn?: string;
  title?: string;
  icon?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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
    throw new ApiError(`API request failed: ${response.status}`, response.status);
  }

  const result: unknown = await response.json();

  if (isRecord(result) && (result.success === false || result.status === false)) {
    const message =
      typeof result.message === "string" ? result.message : "API request failed";
    throw new Error(message);
  }

  return result;
}

function unwrap(data: unknown): unknown {
  let result = data;

  for (let i = 0; i < 5; i++) {
    if (isRecord(result) && result.data !== undefined) {
      result = result.data;
    } else if (isRecord(result) && result.result !== undefined) {
      result = result.result;
    } else {
      break;
    }
  }

  return result;
}

function extractArray<T extends object>(
  data: unknown,
  keys: string[],
  endpoint: string
): T[] {
  const result = unwrap(data);

  if (Array.isArray(result)) {
    if (result.every(isRecord)) return result as T[];
    throw new Error(`Invalid ${endpoint} response: expected object entries`);
  }

  for (const key of keys) {
    if (isRecord(result) && Array.isArray(result[key])) {
      const items = result[key];
      if (items.every(isRecord)) return items as T[];
      throw new Error(`Invalid ${endpoint} response: expected object entries`);
    }
  }

  throw new Error(`Invalid ${endpoint} response: expected an array`);
}

function extractEntity<T extends object>(
  data: unknown,
  entityKeys: string[]
): T | null {
  let result = unwrap(data);

  for (let i = 0; i < 5; i++) {
    if (Array.isArray(result)) {
      result = result[0];
      continue;
    }

    if (!isRecord(result)) return null;

    const record = result;
    const entityKey = entityKeys.find((key) => record[key] !== undefined);
    if (entityKey) {
      result = record[entityKey];
      continue;
    }

    return record as T;
  }

  return null;
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const data = await apiRequest("/products");

  return extractArray<Product>(data, ["products", "items", "results"], "products");
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const data = await apiRequest("/categories");

  return extractArray<Category>(
    data,
    ["categories", "items", "results"],
    "categories"
  );
}

// Get products by category
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const data = await apiRequest(
    `/products?category=${encodeURIComponent(category)}`
  );

  return extractArray<Product>(data, ["products", "items", "results"], "products");
}

// Get a single product by slug or ID
export async function getProduct(
  slugOrId: string
): Promise<Product | null> {
  const searchValue = slugOrId.toLowerCase();
  const products = await getProducts();
  const matchedProduct = products.find((product) => {
    const slug = String(product.slug ?? "").toLowerCase();
    const id = String(product.id ?? product._id ?? "").toLowerCase();

    return slug === searchValue || id === searchValue;
  });

  if (matchedProduct) {
    return matchedProduct;
  }

  try {
    const data = await apiRequest(
      `/products/${encodeURIComponent(slugOrId)}`
    );
    return extractEntity<Product>(data, ["product", "item"]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
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

    return extractEntity<Category>(data, ["category", "item"]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
