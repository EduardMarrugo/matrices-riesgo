import type { ProcessEntity, UnifiedActivity } from '@/core/types/process'
import { ControlsSummary } from '@/modules/processes/components/ControlsSummary'
import { ActivityActions } from './ActivityActions'

interface CaracterizacionViewProps {
  process: ProcessEntity
  onEdit: (index: number) => void
  onDuplicate: (index: number) => void
  onDelete: (index: number) => void
}

export function CaracterizacionView({
  process,
  onEdit,
  onDuplicate,
  onDelete,
}: CaracterizacionViewProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Caracterización del proceso
        </h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Meta label="Nombre" value={process.name} />
          <Meta label="Responsable" value={process.owner || 'Sin asignar'} />
          <Meta
            label="Actividades"
            value={`${process.activities.length} registradas`}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <Meta
              label="Descripción / objetivo"
              value={process.description || 'Sin descripción'}
            />
          </div>
        </dl>
      </div>

      {process.activities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Aún no hay actividades en este proceso.
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <ul className="space-y-3 md:hidden">
            {process.activities.map((activity, index) => (
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
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-10 px-3 py-2">#</th>
                  <th className="px-3 py-2">Actividad</th>
                  <th className="px-3 py-2">Descripción</th>
                  <th className="w-44 px-3 py-2">Responsable</th>
                  <th className="w-32 px-3 py-2">Controles</th>
                  <th className="w-44 px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {process.activities.map((activity, index) => (
                  <tr key={activity.id} className="align-top hover:bg-slate-50/60">
                    <td className="px-3 py-3 text-xs text-slate-400">{index + 1}</td>
                    <td className="px-3 py-3 text-sm font-medium text-slate-800">
                      {activity.name || '(sin nombre)'}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {activity.description || (
                        <span className="italic text-slate-400">Sin descripción</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">
                      {activity.responsibleRole || (
                        <span className="text-xs italic text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <ControlsSummary controls={activity.controls} />
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
        </>
      )}
    </div>
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
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          #{index + 1}
        </p>
        <h3 className="break-words text-sm font-semibold text-slate-800">
          {activity.name || '(sin nombre)'}
        </h3>
      </header>

      {activity.description ? (
        <p className="mt-2 text-xs text-slate-600">{activity.description}</p>
      ) : (
        <p className="mt-2 text-xs italic text-slate-400">Sin descripción</p>
      )}

      <p className="mt-2 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Responsable:</span>{' '}
        {activity.responsibleRole || '—'}
      </p>

      <div className="mt-3">
        <ControlsSummary controls={activity.controls} />
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

interface MetaProps {
  label: string
  value: string
}

function Meta({ label, value }: MetaProps) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-sm text-slate-800">{value}</dd>
    </div>
  )
}
