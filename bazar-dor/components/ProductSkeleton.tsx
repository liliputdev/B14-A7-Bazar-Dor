
export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-100" />
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-3">
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-5 w-24 rounded bg-gray-200" />
            </div>
            <div className="h-6 w-14 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
