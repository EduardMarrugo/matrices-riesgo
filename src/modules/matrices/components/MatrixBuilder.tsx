import { useMatrixStore } from '@/core/stores/useMatrixStore'
import { CreateClientForm } from './CreateClientForm'
import { CreateMatrixForm } from './CreateMatrixForm'
import { MatrixEditor } from './MatrixEditor'
import { MatrixList } from './MatrixList'
import { MatrixToolbar } from './MatrixToolbar'

export function MatrixBuilder() {
  const activeClient = useMatrixStore((state) =>
    state.clients.find((client) => client.id === state.activeClientId) ?? null,
  )
  const activeMatrix = useMatrixStore((state) =>
    state.matrices.find((matrix) => matrix.id === state.activeMatrixId) ?? null,
  )
  const firstClientId = useMatrixStore((state) => state.clients[0]?.id ?? null)
  const hasClients = useMatrixStore((state) => state.clients.length > 0)
  const selectClient = useMatrixStore((state) => state.selectClient)
  const selectMatrix = useMatrixStore((state) => state.selectMatrix)

  if (!activeClient) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {hasClients
                  ? 'Registrar nuevo cliente'
                  : 'Bienvenido al Constructor de Matrices IPEVAR'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {hasClients
                  ? 'Completa los datos del nuevo cliente. Si fue un error, puedes cancelar y volver al cliente anterior.'
                  : 'Empieza creando un cliente para comenzar a gestionar matrices de riesgo.'}
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

  if (!activeMatrix) {
    return (
      <div className="space-y-6">
        <header>
          <h2 className="text-lg font-semibold text-slate-800">
            {activeClient.name}
          </h2>
          <p className="text-sm text-slate-500">
            Sector: {activeClient.sector}. Selecciona o crea una matriz para
            empezar a evaluar riesgos.
          </p>
        </header>
        <CreateMatrixForm clientId={activeClient.id} />
        <MatrixList clientId={activeClient.id} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => selectMatrix(null)}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            ← Volver a matrices de {activeClient.name}
          </button>
          <h2 className="mt-1 text-lg font-semibold text-slate-800">
            {activeMatrix.name}
          </h2>
          <p className="text-sm text-slate-500">
            Cliente: {activeClient.name} · Última actualización{' '}
            {new Date(activeMatrix.updatedAt).toLocaleString('es-CO')}
          </p>
        </div>
        <MatrixToolbar matrix={activeMatrix} />
      </header>

      <MatrixEditor matrix={activeMatrix} />
    </div>
  )
}
