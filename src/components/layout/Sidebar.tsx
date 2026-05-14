import { useMatrixStore } from '@/core/stores/useMatrixStore'

const navItems = [
  { label: 'Resumen', active: true },
  { label: 'Matrices IPEVAR', active: false },
  { label: 'Indicadores', active: false },
  { label: 'Configuración', active: false },
]

export function Sidebar() {
  const clients = useMatrixStore((state) => state.clients)
  const activeClientId = useMatrixStore((state) => state.activeClientId)
  const selectClient = useMatrixStore((state) => state.selectClient)

  const hasClients = clients.length > 0

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h1 className="text-base font-semibold text-slate-800">SGSST · IPEVAR</h1>
        <p className="text-xs text-slate-500">Matrices de riesgo laboral</p>
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
            onChange={(event) => selectClient(event.target.value || null)}
            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
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
      </div>

      <nav className="flex-1 px-3 pb-4">
        <ul className="space-y-1 text-sm">
          {navItems.map((item) => (
            <SidebarLink key={item.label} label={item.label} active={item.active} />
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
  active?: boolean
}

function SidebarLink({ label, active = false }: SidebarLinkProps) {
  const base = 'block rounded-md px-3 py-2 transition-colors'
  const styles = active
    ? 'bg-slate-900 text-white'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  return (
    <li>
      <a href="#" className={`${base} ${styles}`}>
        {label}
      </a>
    </li>
  )
}
