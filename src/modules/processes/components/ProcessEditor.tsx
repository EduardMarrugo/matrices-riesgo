import { useMemo, useState, type ReactNode } from 'react'
import type { ProcessEntity, UnifiedActivity } from '@/core/types/process'
import { useProcessStore } from '@/core/stores/useProcessStore'
import { newId } from '@/core/utils/id'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  computeRiskLevel,
  getAcceptability,
} from '@/core/utils/risk'
import { HAZARD_TYPES } from '@/core/utils/processCatalog'
import type { ActivityFormValues } from '@/modules/processes/schemas/activity.schema'
import { ActivityDialog } from './ActivityDialog'
import { CaracterizacionView } from './views/CaracterizacionView'
import { HeatmapView } from './views/HeatmapView'
import { MasoView } from './views/MasoView'
import { MipView } from './views/MipView'

type ViewMode =
  | 'caracterizacion'
  | 'mip'
  | 'mip-heatmap'
  | 'maso'
  | 'maso-heatmap'

type DialogMode = { kind: 'new' } | { kind: 'edit'; index: number } | null

interface ProcessEditorProps {
  process: ProcessEntity
}

const VIEWS: Array<{ id: ViewMode; label: string }> = [
  { id: 'caracterizacion', label: 'Caracterización' },
  { id: 'mip', label: 'MIP (SST)' },
  { id: 'mip-heatmap', label: 'MIP · Mapa de calor' },
  { id: 'maso', label: 'MASO (Ambiental)' },
  { id: 'maso-heatmap', label: 'MASO · Mapa de calor' },
]

const VIEW_DESCRIPTIONS: Record<ViewMode, string> = {
  caracterizacion:
    'Vista del proceso: metadatos, actividades, responsables y controles. Útil para auditoría documental.',
  mip:
    'Matriz de Identificación de Peligros (MIP) — proyecta los nodos SST de cada actividad: tipo de peligro, controles, valoración NP × NC.',
  'mip-heatmap':
    'Mapa de calor SST: distribución de actividades por Probabilidad × Consecuencia, coloreado por aceptabilidad.',
  maso:
    'Matriz de Aspectos e Impactos Ambientales (MASO) — proyecta los nodos ambientales y su valoración independiente.',
  'maso-heatmap':
    'Mapa de calor MASO: distribución de aspectos ambientales por Probabilidad × Consecuencia.',
}

const blankActivity = (): ActivityFormValues => ({
  id: newId(),
  name: '',
  description: '',
  responsibleRole: '',
  controls: { engineering: '', administrative: '', ppe: '' },
  sst: {
    hazardType: HAZARD_TYPES[0],
    hazardDescription: '',
    effects: '',
    probability: PROBABILITY_OPTIONS[0].value,
    consequence: CONSEQUENCE_OPTIONS[0].value,
    isPriority: false,
  },
  maso: {
    aspect: '',
    impact: '',
    probability: PROBABILITY_OPTIONS[0].value,
    consequence: CONSEQUENCE_OPTIONS[0].value,
    isSignificant: false,
  },
})

const toFormValues = (activity: UnifiedActivity): ActivityFormValues => ({
  id: activity.id,
  name: activity.name,
  description: activity.description,
  responsibleRole: activity.responsibleRole,
  controls: { ...activity.controls },
  sst: {
    hazardType: activity.sst.hazardType,
    hazardDescription: activity.sst.hazardDescription,
    effects: activity.sst.effects,
    probability: activity.sst.probability,
    consequence: activity.sst.consequence,
    isPriority: activity.sst.isPriority,
  },
  maso: {
    aspect: activity.maso.aspect,
    impact: activity.maso.impact,
    probability: activity.maso.probability,
    consequence: activity.maso.consequence,
    isSignificant: activity.maso.isSignificant,
  },
})

const toStoredActivity = (values: ActivityFormValues): UnifiedActivity => {
  const sstLevel = computeRiskLevel(values.sst.probability, values.sst.consequence)
  const masoLevel = computeRiskLevel(values.maso.probability, values.maso.consequence)
  return {
    id: values.id,
    name: values.name,
    description: values.description,
    responsibleRole: values.responsibleRole,
    controls: values.controls,
    sst: {
      ...values.sst,
      riskLevel: sstLevel,
      acceptability: getAcceptability(sstLevel),
    },
    maso: {
      ...values.maso,
      riskLevel: masoLevel,
      acceptability: getAcceptability(masoLevel),
    },
  }
}

export function ProcessEditor({ process }: ProcessEditorProps) {
  const updateActivities = useProcessStore((state) => state.updateActivities)
  const [view, setView] = useState<ViewMode>('caracterizacion')
  const [dialog, setDialog] = useState<DialogMode>(null)

  const activities = process.activities

  const handleAdd = () => setDialog({ kind: 'new' })
  const handleEdit = (index: number) => setDialog({ kind: 'edit', index })

  const handleDuplicate = (index: number) => {
    const original = activities[index]
    if (!original) return
    const copy: UnifiedActivity = { ...original, id: newId() }
    const next = [...activities]
    next.splice(index + 1, 0, copy)
    updateActivities(process.id, next)
  }

  const handleDelete = (index: number) => {
    if (!window.confirm('¿Eliminar esta actividad?')) return
    const next = activities.filter((_, i) => i !== index)
    updateActivities(process.id, next)
  }

  const handleSave = (values: ActivityFormValues) => {
    if (!dialog) return
    const stored = toStoredActivity(values)
    if (dialog.kind === 'new') {
      updateActivities(process.id, [...activities, stored])
    } else {
      const next = activities.map((a, i) => (i === dialog.index ? stored : a))
      updateActivities(process.id, next)
    }
    setDialog(null)
  }

  const dialogInitial = useMemo<ActivityFormValues>(() => {
    if (!dialog) return blankActivity()
    if (dialog.kind === 'new') return blankActivity()
    const target = activities[dialog.index]
    return target ? toFormValues(target) : blankActivity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog])

  return (
    <div className="space-y-4">
      <div className="-mx-3 overflow-x-auto border-b border-slate-200 sm:mx-0">
        <div className="flex w-max items-center gap-1 px-3 sm:w-auto sm:flex-wrap sm:px-0">
          {VIEWS.map((option) => (
            <ViewTab
              key={option.id}
              active={view === option.id}
              onClick={() => setView(option.id)}
            >
              {option.label}
            </ViewTab>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">{VIEW_DESCRIPTIONS[view]}</p>

      {view === 'caracterizacion' && (
        <CaracterizacionView
          process={process}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
      {view === 'mip' && (
        <MipView
          activities={activities}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
      {view === 'mip-heatmap' && (
        <HeatmapView activities={activities} methodology="sst" />
      )}
      {view === 'maso' && (
        <MasoView
          activities={activities}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
      {view === 'maso-heatmap' && (
        <HeatmapView activities={activities} methodology="maso" />
      )}

      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          + Agregar actividad
        </button>
        <p className="text-center text-xs text-slate-500 sm:text-right">
          {activities.length}{' '}
          {activities.length === 1 ? 'actividad' : 'actividades'} en el proceso
        </p>
      </div>

      {dialog && (
        <ActivityDialog
          title={
            dialog.kind === 'new'
              ? 'Nueva actividad'
              : `Editar actividad ${dialog.index + 1}`
          }
          initialValues={dialogInitial}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}

interface ViewTabProps {
  active: boolean
  onClick: () => void
  children: ReactNode
}

function ViewTab({ active, onClick, children }: ViewTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors ${
        active
          ? 'border-slate-900 font-medium text-slate-900'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}
