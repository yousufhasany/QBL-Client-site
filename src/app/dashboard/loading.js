export default function DashboardLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse"></div>
        </div>
        <div className="h-12 w-44 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-5 h-36 animate-pulse">
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
