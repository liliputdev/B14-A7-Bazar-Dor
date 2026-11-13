"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/api";
import { sortProducts, type ProductSortOption } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

export default function SortableProductGrid({
  products,
}: {
  products: Product[];
}) {
  const [sortOption, setSortOption] =
    useState<ProductSortOption>("default");
  const sortedProducts = useMemo(
    () => sortProducts(products, sortOption),
    [products, sortOption]
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2">
        <label htmlFor="product-sort" className="text-sm text-gray-600">
          দামের ক্রম
        </label>
        <select
          id="product-sort"
          value={sortOption}
          onChange={(event) =>
            setSortOption(event.target.value as ProductSortOption)
          }
          className="select select-bordered select-sm bg-white"
        >
          <option value="default">ডিফল্ট</option>
          <option value="asc">কম থেকে বেশি</option>
          <option value="desc">বেশি থেকে কম</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product, index) => (
          <ProductCard
            key={product.id ?? product._id ?? product.slug ?? index}
            product={product}
          />
        ))}
      </div>
    </>
  );
}
