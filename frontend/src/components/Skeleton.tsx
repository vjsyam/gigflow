export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4">
          <div className="skeleton h-9 w-9 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/4" />
          </div>
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-16" />
    </div>
  );
}
