export default function AdminLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Sayfa yükleniyor">
      <div className="h-9 w-64 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border-2 border-slate-100 bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl border-2 border-slate-100 bg-white" />
      <span className="sr-only">Yükleniyor…</span>
    </div>
  );
}
