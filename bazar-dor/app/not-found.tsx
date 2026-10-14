import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-emerald-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        পৃষ্ঠাটি পাওয়া যায়নি
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        আপনি যে লিংকটি খুঁজছেন তা বিদ্যমান নেই অথবা অন্য কোনো ঠিকানায় সরিয়ে নেওয়া হয়েছে।
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}