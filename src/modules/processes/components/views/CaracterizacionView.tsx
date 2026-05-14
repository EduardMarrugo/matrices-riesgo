import type { ProcessEntity } from '@/core/types/process'
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
        <dl className="mt-3 grid gap-3 sm:grid-cols-3">
          <Meta label="Nombre" value={process.name} />
          <Meta label="Responsable" value={process.owner || 'Sin asignar'} />
          <Meta
            label="Actividades"
            value={`${process.activities.length} registradas`}
          />
          <div className="sm:col-span-3">
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
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
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
      )}
    </div>
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
      <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
    </div>
  )
}
