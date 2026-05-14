import { useProcessStore } from '@/core/stores/useProcessStore'
import { CreateClientForm } from './CreateClientForm'
import { CreateProcessForm } from './CreateProcessForm'
import { ProcessEditor } from './ProcessEditor'
import { ProcessList } from './ProcessList'
import { ProcessToolbar } from './ProcessToolbar'

export function ProcessBuilder() {
  const activeClient = useProcessStore((state) =>
    state.clients.find((client) => client.id === state.activeClientId) ?? null,
  )
  const activeProcess = useProcessStore((state) =>
    state.processes.find((process) => process.id === state.activeProcessId) ?? null,
  )
  const firstClientId = useProcessStore((state) => state.clients[0]?.id ?? null)
  const hasClients = useProcessStore((state) => state.clients.length > 0)
  const selectClient = useProcessStore((state) => state.selectClient)
  const selectProcess = useProcessStore((state) => state.selectProcess)

  if (!activeClient) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {hasClients
                  ? 'Registrar nuevo cliente'
                  : 'Bienvenido al SGSST · Procesos SSOT'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {hasClients
                  ? 'Completa los datos del nuevo cliente. Si fue un error, puedes cancelar y volver al cliente anterior.'
                  : 'Empieza creando un cliente. Cada cliente puede tener varios procesos, y cada proceso se audita desde tres perspectivas: Caracterización, MIP (SST) y MASO (Ambiental).'}
              </p>
            </div>
            {hasClients && firstClientId && (
              <button
                type="button"
                onClick={() => selectClient(firstClientId)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                ← Cancelar
              </button>
            )}
          </div>
        </div>
        <CreateClientForm />
      </div>
    )
  }

  if (!activeProcess) {
    return (
      <div className="space-y-6">
        <header>
          <h2 className="text-lg font-semibold text-slate-800">
            {activeClient.name}
          </h2>
          <p className="text-sm text-slate-500">
            Sector: {activeClient.sector}. Selecciona o crea un proceso para
            empezar a evaluar SST y aspectos ambientales.
          </p>
        </header>
        <CreateProcessForm clientId={activeClient.id} />
        <ProcessList clientId={activeClient.id} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => selectProcess(null)}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            ← Volver a procesos de {activeClient.name}
          </button>
          <h2 className="mt-1 break-words text-lg font-semibold text-slate-800">
            {activeProcess.name}
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Cliente: {activeClient.name}
            {activeProcess.owner && <> · Responsable: {activeProcess.owner}</>}
            {' · '}
            Actualizado{' '}
            {new Date(activeProcess.updatedAt).toLocaleString('es-CO')}
          </p>
        </div>
        <ProcessToolbar process={activeProcess} />
      </header>

      <ProcessEditor process={activeProcess} />
    </div>
  )
}
