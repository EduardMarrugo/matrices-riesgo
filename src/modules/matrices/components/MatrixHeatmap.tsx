import { useMemo } from 'react'
import { useWatch, type Control } from 'react-hook-form'
import type { Acceptability } from '@/core/types/matrix'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  computeRiskLevel,
  getAcceptability,
} from '@/core/utils/risk'
import type {
  MatrixFormValues,
  MatrixRowFormValues,
} from '@/modules/matrices/schemas/matrixForm.schema'

interface MatrixHeatmapProps {
  control: Control<MatrixFormValues>
}

const CELL_STYLES: Record<Acceptability, string> = {
  acceptable: 'bg-emerald-200/80 border-emerald-300 text-emerald-950',
  tolerable: 'bg-amber-200/80 border-amber-300 text-amber-950',
  critical: 'bg-red-300/80 border-red-400 text-red-950',
}

const CELL_LABELS: Record<Acceptability, string> = {
  acceptable: 'Aceptable',
  tolerable: 'Tolerable',
  critical: 'No aceptable',
}

export function MatrixHeatmap({ control }: MatrixHeatmapProps) {
  const watchedRows = useWatch({ control, name: 'rows' })
  const rows: MatrixRowFormValues[] = watchedRows ?? []

  const probabilities = useMemo(
    () => [...PROBABILITY_OPTIONS].slice().reverse(),
    [],
  )
  const consequences = CONSEQUENCE_OPTIONS

  const cellMap = useMemo(() => {
    const map = new Map<string, MatrixRowFormValues[]>()
    for (const row of rows) {
      const key = `${row.probability}-${row.consequence}`
      const list = map.get(key) ?? []
      list.push(row)
      map.set(key, list)
    }
    return map
  }, [rows])

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1 text-center text-xs">
          <thead>
            <tr>
              <th className="w-32" />
              <th
                colSpan={consequences.length}
                className="pb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500"
              >
                Consecuencia →
              </th>
            </tr>
            <tr>
              <th className="text-right text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Probabilidad ↓
              </th>
              {consequences.map((consequence) => (
                <th
                  key={consequence.value}
                  className="px-1 pb-2 text-[11px] font-semibold text-slate-600"
                >
                  {consequence.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {probabilities.map((probability) => (
              <tr key={probability.value}>
                <th className="px-2 text-right text-[11px] font-semibold text-slate-600">
                  {probability.label}
                </th>
                {consequences.map((consequence) => {
                  const level = computeRiskLevel(probability.value, consequence.value)
                  const acceptability = getAcceptability(level)
                  const activities = cellMap.get(
                    `${probability.value}-${consequence.value}`,
                  ) ?? []
                  return (
                    <td
                      key={consequence.value}
                      className={`relative h-20 rounded-md border ${CELL_STYLES[acceptability]}`}
                      title={
                        activities.length === 0
                          ? `${level} · ${CELL_LABELS[acceptability]}`
                          : `${level} · ${CELL_LABELS[acceptability]}\n` +
                            activities
                              .map((row) => `• ${row.activity || '(sin nombre)'}`)
                              .join('\n')
                      }
                    >
                      <div className="flex h-full flex-col items-center justify-center gap-1 px-1">
                        <span className="text-base font-bold tabular-nums leading-none">
                          {level}
                        </span>
                        {activities.length > 0 && (
                          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm">
                            {activities.length}{' '}
                            {activities.length === 1 ? 'actividad' : 'actividades'}
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Legend />

      {rows.length > 0 && <ActivityList rows={rows} />}
    </div>
  )
}

function Legend() {
  const items: Array<{ acceptability: Acceptability; range: string }> = [
    { acceptability: 'acceptable', range: 'NR ≤ 40' },
    { acceptability: 'tolerable', range: '40 < NR < 200' },
    { acceptability: 'critical', range: 'NR ≥ 200' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
      <span className="font-medium uppercase tracking-wide text-slate-500">
        Leyenda
      </span>
      {items.map((item) => (
        <span key={item.acceptability} className="inline-flex items-center gap-1.5">
          <span
            className={`h-3 w-5 rounded border ${CELL_STYLES[item.acceptability]}`}
          />
          <span>
            {CELL_LABELS[item.acceptability]} ({item.range})
          </span>
        </span>
      ))}
    </div>
  )
}

interface ActivityListProps {
  rows: MatrixRowFormValues[]
}

function ActivityList({ rows }: ActivityListProps) {
  const grouped = useMemo(() => {
    const map = new Map<Acceptability, MatrixRowFormValues[]>([
      ['critical', []],
      ['tolerable', []],
      ['acceptable', []],
    ])
    for (const row of rows) {
      const acceptability = getAcceptability(
        computeRiskLevel(row.probability, row.consequence),
      )
      map.get(acceptability)!.push(row)
    }
    return map
  }, [rows])

  return (
    <div className="grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3">
      {(['critical', 'tolerable', 'acceptable'] as const).map((acceptability) => {
        const list = grouped.get(acceptability) ?? []
        if (list.length === 0) return null
        return (
          <div key={acceptability} className="space-y-1">
            <h4
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${CELL_STYLES[acceptability]}`}
            >
              {CELL_LABELS[acceptability]} · {list.length}
            </h4>
            <ul className="space-y-0.5 text-xs text-slate-600">
              {list.map((row) => (
                <li key={row.id} className="truncate">
                  • {row.activity || '(sin nombre)'} —{' '}
                  <span className="text-slate-400">
                    NR {computeRiskLevel(row.probability, row.consequence)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
