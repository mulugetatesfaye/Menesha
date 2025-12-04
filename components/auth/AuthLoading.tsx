export function AuthLoading() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
    </div>
  );
}
