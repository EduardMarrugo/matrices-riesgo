export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-sm">
        <span className="font-medium text-slate-800">Panel principal</span>
        <span className="ml-2 text-slate-400">/ Resumen</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="hidden sm:inline">Auditor SST</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
          AS
        </div>
      </div>
    </header>
  )
}
