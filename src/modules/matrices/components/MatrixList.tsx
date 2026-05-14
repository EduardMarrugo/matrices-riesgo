import { useMatrixStore } from '@/core/stores/useMatrixStore'

interface MatrixListProps {
  clientId: string
}

export function MatrixList({ clientId }: MatrixListProps) {
  const matrices = useMatrixStore((state) =>
    state.matrices.filter((matrix) => matrix.clientId === clientId),
  )
  const activeMatrixId = useMatrixStore((state) => state.activeMatrixId)
  const selectMatrix = useMatrixStore((state) => state.selectMatrix)

  if (matrices.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Este cliente aún no tiene matrices. Crea la primera arriba.
      </p>
    )
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {matrices.map((matrix) => {
        const isActive = matrix.id === activeMatrixId
        return (
          <li key={matrix.id}>
            <button
              type="button"
              onClick={() => selectMatrix(matrix.id)}
              className={`flex w-full flex-col items-start gap-1 rounded-xl border bg-white p-4 text-left transition-colors ${
                isActive
                  ? 'border-slate-900 ring-1 ring-slate-900'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold text-slate-800">
                {matrix.name}
              </span>
              <span className="text-xs text-slate-500">
                {matrix.rows.length} filas · actualizada{' '}
                {new Date(matrix.updatedAt).toLocaleDateString('es-CO')}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
