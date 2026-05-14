import type { UnifiedActivity } from '@/core/types/process'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  type ScaleOption,
} from '@/core/utils/risk'
import { AcceptabilityBadge } from '@/modules/processes/components/AcceptabilityBadge'
import { ControlsSummary } from '@/modules/processes/components/ControlsSummary'
import { ActivityActions } from './ActivityActions'

interface MipViewProps {
  activities: UnifiedActivity[]
  onEdit: (index: number) => void
  onDuplicate: (index: number) => void
  onDelete: (index: number) => void
}

export function MipView({ activities, onEdit, onDuplicate, onDelete }: MipViewProps) {
  if (activities.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-10 px-3 py-2">#</th>
            <th className="px-3 py-2">Actividad y peligro</th>
            <th className="px-3 py-2">Controles</th>
            <th className="w-32 px-3 py-2">Probabilidad</th>
            <th className="w-32 px-3 py-2">Consecuencia</th>
            <th className="w-44 px-3 py-2">Nivel SST</th>
            <th className="w-44 px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {activities.map((activity, index) => (
            <tr key={activity.id} className="align-top hover:bg-slate-50/60">
              <td className="px-3 py-3 text-xs text-slate-400">{index + 1}</td>
              <td className="px-3 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.name || '(sin nombre)'}
                    {activity.sst.isPriority && (
                      <span className="ml-2 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                        PRIORITARIO
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-600">
                      {activity.sst.hazardType}:
                    </span>{' '}
                    {activity.sst.hazardDescription}
                  </p>
                </div>
              </td>
              <td className="px-3 py-3">
                <ControlsSummary controls={activity.controls} />
              </td>
              <td className="px-3 py-3 text-sm text-slate-700">
                {labelFor(PROBABILITY_OPTIONS, activity.sst.probability)}
              </td>
              <td className="px-3 py-3 text-sm text-slate-700">
                {labelFor(CONSEQUENCE_OPTIONS, activity.sst.consequence)}
              </td>
              <td className="px-3 py-3">
                <AcceptabilityBadge
                  acceptability={activity.sst.acceptability}
                  riskLevel={activity.sst.riskLevel}
                />
              </td>
              <td className="px-3 py-3">
                <ActivityActions
                  onEdit={() => onEdit(index)}
                  onDuplicate={() => onDuplicate(index)}
                  onDelete={() => onDelete(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
      Aún no hay actividades en este proceso.
    </div>
  )
}

const labelFor = (options: readonly ScaleOption[], value: number): string =>
  options.find((option) => option.value === value)?.label ?? `${value}`
