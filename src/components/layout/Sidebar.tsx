import { useProcessStore } from '@/core/stores/useProcessStore'
import { useUiStore, type ActiveView } from '@/core/stores/useUiStore'

interface NavItem {
  view: ActiveView
  label: string
}

const navItems: readonly NavItem[] = [
  { view: 'matrices', label: 'Procesos · Matrices' },
  { view: 'indicators', label: 'Indicadores SGSST' },
]

export function Sidebar() {
  const clients = useProcessStore((state) => state.clients)
  const activeClientId = useProcessStore((state) => state.activeClientId)
  const selectClient = useProcessStore((state) => state.selectClient)
  const activeView = useUiStore((state) => state.activeView)
  const setActiveView = useUiStore((state) => state.setActiveView)
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)

  const hasClients = clients.length > 0
  const closeOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <aside
      role="navigation"
      aria-label="Menú lateral"
      className="flex h-full w-[85vw] max-w-[320px] shrink-0 flex-col border-r border-slate-200 bg-white sm:w-72 lg:w-64"
    >
      <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h1 className="text-base font-semibold text-slate-800">SGSST · SSOT</h1>
          <p className="text-xs text-slate-500">Procesos · MIP · MASO</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
          className="-mr-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="px-5 py-4">
        <label
          htmlFor="active-client"
          className="text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Cliente activo
        </label>
        {hasClients ? (
          <select
            id="active-client"
            value={activeClientId ?? ''}
            onChange={(event) => {
              const next = event.target.value
              selectClient(next === '' ? null : next)
              setActiveView('matrices')
              closeOnMobile()
            }}
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            <option value="" disabled>
              Selecciona un cliente
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="mt-2 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Sin clientes registrados aún.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            selectClient(null)
            setActiveView('matrices')
            closeOnMobile()
          }}
          className="mt-2 w-full rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          + Nuevo cliente
        </button>
      </div>

      <nav className="flex-1 px-3 pb-4">
        <ul className="space-y-1 text-sm">
          {navItems.map((item) => (
            <SidebarLink
              key={item.view}
              label={item.label}
              active={activeView === item.view}
              onClick={() => {
                setActiveView(item.view)
                closeOnMobile()
              }}
            />
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-400">
        v0.1.0
      </div>
    </aside>
  )
}

interface SidebarLinkProps {
  label: string
  active: boolean
  onClick: () => void
}

function SidebarLink({ label, active, onClick }: SidebarLinkProps) {
  const base = 'block w-full rounded-md px-3 py-2 text-left transition-colors'
  const styles = active
    ? 'bg-slate-900 text-white'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  return (
    <li>
      <button type="button" onClick={onClick} className={`${base} ${styles}`}>
        {label}
      </button>
    </li>
  )
}
