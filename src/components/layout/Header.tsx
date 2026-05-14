import { useUiStore, type ActiveView } from '@/core/stores/useUiStore'

const VIEW_LABELS: Record<ActiveView, string> = {
  matrices: 'Procesos · Matrices',
  indicators: 'Indicadores SGSST',
}

export function Header() {
  const activeView = useUiStore((state) => state.activeView)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Abrir menú"
          className="-ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div>
          <span className="font-medium text-slate-800">Panel</span>
          <span className="ml-2 hidden text-slate-400 sm:inline">
            / {VIEW_LABELS[activeView]}
          </span>
        </div>
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
