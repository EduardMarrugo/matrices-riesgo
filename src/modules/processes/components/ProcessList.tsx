import { useMemo } from 'react'
import { useProcessStore } from '@/core/stores/useProcessStore'

interface ProcessListProps {
  clientId: string
}

export function ProcessList({ clientId }: ProcessListProps) {
  const allProcesses = useProcessStore((state) => state.processes)
  const activeProcessId = useProcessStore((state) => state.activeProcessId)
  const selectProcess = useProcessStore((state) => state.selectProcess)

  const processes = useMemo(
    () => allProcesses.filter((process) => process.clientId === clientId),
    [allProcesses, clientId],
  )

  if (processes.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Este cliente aún no tiene procesos. Crea uno arriba o carga el de ejemplo.
      </p>
    )
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {processes.map((process) => {
        const isActive = process.id === activeProcessId
        return (
          <li key={process.id}>
            <button
              type="button"
              onClick={() => selectProcess(process.id)}
              className={`flex w-full flex-col items-start gap-1 rounded-xl border bg-white p-4 text-left transition-colors ${
                isActive
                  ? 'border-slate-900 ring-1 ring-slate-900'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold text-slate-800">
                {process.name}
              </span>
              <span className="text-xs text-slate-500">
                {process.activities.length} actividades · actualizado{' '}
                {new Date(process.updatedAt).toLocaleDateString('es-CO')}
              </span>
              {process.owner && (
                <span className="text-xs text-slate-400">
                  Responsable: {process.owner}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
