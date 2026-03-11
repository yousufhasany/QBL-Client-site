export default function SessionLoading() {
  return (
    <div>
      <div className="glass-card rounded-2xl p-6 mb-8 animate-pulse">
        <div className="h-7 w-64 bg-gray-200 rounded mb-3"></div>
        <div className="flex gap-3">
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-16 animate-pulse">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-8 h-80 animate-pulse flex items-center justify-center">
          <div className="h-48 w-48 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
