'use client';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'chart' | 'line';
  count?: number;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-lg p-6 border">
      <div className="shimmer mb-4 h-4 w-1/3 rounded"></div>
      <div className="shimmer mb-2 h-8 w-1/2 rounded"></div>
      <div className="shimmer h-3 w-1/4 rounded"></div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass rounded-lg border">
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="shimmer h-4 flex-1 rounded"></div>
            <div className="shimmer h-4 w-24 rounded"></div>
            <div className="shimmer h-4 w-20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass rounded-lg border p-6">
      <div className="shimmer mb-4 h-4 w-1/3 rounded"></div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="shimmer h-2 flex-1 rounded"></div>
            <div className="shimmer h-4 w-12 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingSkeleton({
  type = 'card',
  count = 1,
}: LoadingSkeletonProps) {
  const skeletons = {
    card: <SkeletonCard />,
    table: <SkeletonTable />,
    chart: <SkeletonChart />,
    line: <div className="shimmer h-12 w-full rounded"></div>,
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i}>{skeletons[type]}</div>
      ))}
    </div>
  );
}
