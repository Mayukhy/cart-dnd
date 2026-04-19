export default function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded mt-1" />
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-full bg-gray-200 rounded mt-2" />
      </div>
    </div>
  );
}
