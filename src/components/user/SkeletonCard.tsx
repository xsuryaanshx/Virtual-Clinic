const SkeletonCard = () => (
  <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
    <div className="shimmer h-4 w-3/4 rounded-lg" />
    <div className="shimmer h-3 w-full rounded-lg" />
    <div className="shimmer h-3 w-5/6 rounded-lg" />
    <div className="shimmer h-8 w-1/3 rounded-lg mt-4" />
  </div>
);

export default SkeletonCard;
