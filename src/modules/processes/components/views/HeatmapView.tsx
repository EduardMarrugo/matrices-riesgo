import { useMemo } from 'react'
import type { Acceptability, UnifiedActivity } from '@/core/types/process'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  computeRiskLevel,
  getAcceptability,
} from '@/core/utils/risk'

type HeatmapMethodology = 'sst' | 'maso'

interface HeatmapViewProps {
  activities: UnifiedActivity[]
  methodology: HeatmapMethodology
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

const METHODOLOGY_LABEL: Record<HeatmapMethodology, string> = {
  sst: 'SST · Peligros',
  maso: 'MASO · Aspectos',
}

export function HeatmapView({ activities, methodology }: HeatmapViewProps) {
  const probabilities = useMemo(
    () => [...PROBABILITY_OPTIONS].slice().reverse(),
    [],
  )
  const consequences = CONSEQUENCE_OPTIONS

  const cellMap = useMemo(() => {
    const map = new Map<string, UnifiedActivity[]>()
    for (const activity of activities) {
      const node = activity[methodology]
      if (methodology === 'maso' && !activity.maso.aspect.trim()) continue
      const key = `${node.probability}-${node.consequence}`
      const list = map.get(key) ?? []
      list.push(activity)
      map.set(key, list)
    }
    return map
  }, [activities, methodology])

  const considered = useMemo(() => {
    if (methodology === 'sst') return activities
    return activities.filter((a) => a.maso.aspect.trim().length > 0)
  }, [activities, methodology])

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          Mapa de calor · {METHODOLOGY_LABEL[methodology]}
        </h3>
        <span className="text-xs text-slate-500">
          {considered.length}{' '}
          {considered.length === 1 ? 'actividad' : 'actividades'}
        </span>
      </header>

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
                  const level = computeRiskLevel(
                    probability.value,
                    consequence.value,
                  )
                  const acceptability = getAcceptability(level)
                  const items = cellMap.get(
                    `${probability.value}-${consequence.value}`,
                  ) ?? []
                  return (
                    <td
                      key={consequence.value}
                      className={`relative h-20 rounded-md border ${CELL_STYLES[acceptability]}`}
                      title={
                        items.length === 0
                          ? `${level} · ${CELL_LABELS[acceptability]}`
                          : `${level} · ${CELL_LABELS[acceptability]}\n` +
                            items
                              .map(
                                (activity) =>
                                  `• ${activity.name || '(sin nombre)'}`,
                              )
                              .join('\n')
                      }
                    >
                      <div className="flex h-full flex-col items-center justify-center gap-1 px-1">
                        <span className="text-base font-bold tabular-nums leading-none">
                          {level}
                        </span>
                        {items.length > 0 && (
                          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm">
                            {items.length}{' '}
                            {items.length === 1 ? 'actividad' : 'actividades'}
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
