import type { UnifiedActivity } from '@/core/types/process'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  type ScaleOption,
} from '@/core/utils/risk'
import { AcceptabilityBadge } from '@/modules/processes/components/AcceptabilityBadge'
import { ActivityActions } from './ActivityActions'

interface MasoViewProps {
  activities: UnifiedActivity[]
  onEdit: (index: number) => void
  onDuplicate: (index: number) => void
  onDelete: (index: number) => void
}

export function MasoView({ activities, onEdit, onDuplicate, onDelete }: MasoViewProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Aún no hay actividades para evaluar aspectos ambientales.
      </div>
    )
  }

  return (
    <>
      {/* Mobile: cards */}
      <ul className="space-y-3 md:hidden">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <ActivityCard
              activity={activity}
              index={index}
              onEdit={() => onEdit(index)}
              onDuplicate={() => onDuplicate(index)}
              onDelete={() => onDelete(index)}
            />
          </li>
        ))}
      </ul>

      {/* Tablet+ : table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-10 px-3 py-2">#</th>
              <th className="px-3 py-2">Actividad</th>
              <th className="px-3 py-2">Aspecto · Impacto</th>
              <th className="w-32 px-3 py-2">Probabilidad</th>
              <th className="w-32 px-3 py-2">Consecuencia</th>
              <th className="w-44 px-3 py-2">Nivel MASO</th>
              <th className="w-44 px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.map((activity, index) => {
              const hasMaso = activity.maso.aspect.trim().length > 0
              return (
                <tr key={activity.id} className="align-top hover:bg-slate-50/60">
                  <td className="px-3 py-3 text-xs text-slate-400">{index + 1}</td>
                  <td className="px-3 py-3 text-sm font-medium text-slate-800">
                    {activity.name || '(sin nombre)'}
                  </td>
                  <td className="px-3 py-3">
                    {hasMaso ? (
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-slate-700">
                          {activity.maso.aspect}
                          {activity.maso.isSignificant && (
                            <span className="ml-2 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                              SIGNIFICATIVO
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">{activity.maso.impact}</p>
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400">
                        Sin aspecto ambiental registrado
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    {labelFor(PROBABILITY_OPTIONS, activity.maso.probability)}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700">
                    {labelFor(CONSEQUENCE_OPTIONS, activity.maso.consequence)}
                  </td>
                  <td className="px-3 py-3">
                    <AcceptabilityBadge
                      acceptability={activity.maso.acceptability}
                      riskLevel={activity.maso.riskLevel}
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
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

interface ActivityCardProps {
  activity: UnifiedActivity
  index: number
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function ActivityCard({
  activity,
  index,
  onEdit,
  onDuplicate,
  onDelete,
}: ActivityCardProps) {
  const hasMaso = activity.maso.aspect.trim().length > 0
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            #{index + 1}
          </p>
          <h3 className="break-words text-sm font-semibold text-slate-800">
            {activity.name || '(sin nombre)'}
          </h3>
        </div>
        {activity.maso.isSignificant && (
          <span className="shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
            SIGNIFICATIVO
          </span>
        )}
      </header>

      {hasMaso ? (
        <div className="mt-2 space-y-0.5 text-xs">
          <p className="font-medium text-slate-700">{activity.maso.aspect}</p>
          <p className="text-slate-500">{activity.maso.impact}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs italic text-slate-400">
          Sin aspecto ambiental registrado.
        </p>
      )}

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Probabilidad
          </dt>
          <dd className="text-slate-700">
            {labelFor(PROBABILITY_OPTIONS, activity.maso.probability)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Consecuencia
          </dt>
          <dd className="text-slate-700">
            {labelFor(CONSEQUENCE_OPTIONS, activity.maso.consequence)}
          </dd>
        </div>
      </dl>

      <div className="mt-3">
        <AcceptabilityBadge
          acceptability={activity.maso.acceptability}
          riskLevel={activity.maso.riskLevel}
        />
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <ActivityActions
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </div>
    </article>
  )
}

const labelFor = (options: readonly ScaleOption[], value: number): string =>
  options.find((option) => option.value === value)?.label ?? `${value}`
