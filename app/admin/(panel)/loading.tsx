export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-48 rounded-full bg-white" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 rounded-3xl bg-white" />
        ))}
      </div>
      <div className="mt-6 h-64 rounded-3xl bg-white" />
    </div>
  );
}