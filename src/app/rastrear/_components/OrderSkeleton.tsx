export function OrderSkeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded-full w-24" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
