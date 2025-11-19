export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((id) => (
        <span
          key={id}
          className="h-2 w-2 animate-bounce rounded-full bg-slate-200"
          style={{ animationDelay: `${id * 0.12}s` }}
        />
      ))}
    </span>
  );
}
