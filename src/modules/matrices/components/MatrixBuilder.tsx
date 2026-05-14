import { useMatrixStore } from '@/core/stores/useMatrixStore'
import { CreateClientForm } from './CreateClientForm'
import { CreateMatrixForm } from './CreateMatrixForm'
import { MatrixEditor } from './MatrixEditor'
import { MatrixList } from './MatrixList'

export function MatrixBuilder() {
  const activeClient = useMatrixStore((state) =>
    state.clients.find((client) => client.id === state.activeClientId) ?? null,
  )
  const activeMatrix = useMatrixStore((state) =>
    state.matrices.find((matrix) => matrix.id === state.activeMatrixId) ?? null,
  )
  const selectMatrix = useMatrixStore((state) => state.selectMatrix)

  if (!activeClient) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Bienvenido al Constructor de Matrices IPEVAR
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Empieza creando un cliente o seleccionando uno existente en la barra
            lateral.
          </p>
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
      </header>

      <MatrixEditor matrix={activeMatrix} />
    </div>
  )
}
