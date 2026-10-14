'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { sortProducts, toBengaliNumber } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import AllProductsSection from '@/components/AllProductsSection';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'default' | 'asc' | 'desc'>('default');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getProducts(slug);
        setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const sortedProducts = sortProducts(products, sortOption);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 capitalize">
          ক্যাটাগরি: {slug}
        </h1>

        {/* C1: Sort Control */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="font-medium text-gray-700">
            সাজান:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="text-gray-500 mb-6">
            এই ক্যাটাগরিতে বর্তমানে কোনো বাজার দর তথ্য নেই।
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 transition"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}