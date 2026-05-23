export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-5 w-1/4 rounded bg-border/60" />
      <div className="h-8 w-2/3 rounded bg-border/60" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-card border border-border/40 p-4">
          <div className="h-3 w-1/3 rounded bg-border/60 mb-3" />
          <div className="h-3 w-full rounded bg-border/60 mb-2" />
          <div className="h-3 w-4/5 rounded bg-border/60" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/60 bg-card p-5">
          <div className="h-3 w-1/2 rounded bg-border/60 mb-4" />
          <div className="h-8 w-1/3 rounded bg-border/60 mb-3" />
          <div className="h-1.5 rounded-full bg-border/60" />
        </div>
      ))}
    </div>
  );
}

export function AskLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg border border-border/60 bg-card" />
        ))}
      </div>
      <div className="h-24 rounded-lg border border-border/60 bg-card" />
      <div className="mx-auto h-10 w-40 rounded-lg bg-primary/20" />
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-20 rounded-full bg-primary/10" />
          <div className="h-4 w-24 rounded bg-border/60" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-border/60" />
          <div className="h-3 w-5/6 rounded bg-border/60" />
          <div className="h-3 w-4/6 rounded bg-border/60" />
          <div className="mt-4 h-20 rounded-lg border border-accent/20 bg-accent/5 p-4">
            <div className="h-3 w-1/3 rounded bg-border/60 mb-2" />
            <div className="h-3 w-3/4 rounded bg-border/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
