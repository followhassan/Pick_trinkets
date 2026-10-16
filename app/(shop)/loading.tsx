export default function ShopLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-48 rounded-full bg-white" />
      <div className="mt-4 h-4 w-72 max-w-full rounded-full bg-white" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <div className="aspect-square rounded-2xl bg-white" />
            <div className="mt-3 h-4 w-3/4 rounded-full bg-white" />
            <div className="mt-2 h-3 w-1/3 rounded-full bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}
