import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { MatrixRow, RiskMatrix } from '@/core/types/matrix'
import { useMatrixStore } from '@/core/stores/useMatrixStore'
import { newId } from '@/core/utils/id'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  computeRiskLevel,
  getAcceptability,
  type ScaleOption,
} from '@/core/utils/risk'
import {
  matrixFormSchema,
  type MatrixFormValues,
  type MatrixRowFormValues,
} from '@/modules/matrices/schemas/matrixForm.schema'
import { AcceptabilityBadge } from './AcceptabilityBadge'
import { MatrixHeatmap } from './MatrixHeatmap'
import { MatrixRowDialog } from './MatrixRowDialog'

type ViewMode = 'table' | 'heatmap'

type DialogMode =
  | { kind: 'new' }
  | { kind: 'edit'; index: number }
  | null

interface MatrixEditorProps {
  matrix: RiskMatrix
}

const blankRow = (): MatrixRowFormValues => ({
  id: newId(),
  activity: '',
  hazard: '',
  controls: { engineering: '', administrative: '', ppe: '' },
  probability: PROBABILITY_OPTIONS[0].value,
  consequence: CONSEQUENCE_OPTIONS[0].value,
})

const toFormValues = (rows: MatrixRow[]): MatrixFormValues => ({
  rows: rows.map(({ riskLevel: _r, acceptability: _a, ...rest }) => rest),
})

const toStoredRows = (values: MatrixFormValues): MatrixRow[] =>
  values.rows.map((row) => {
    const riskLevel = computeRiskLevel(row.probability, row.consequence)
    return {
      ...row,
      riskLevel,
      acceptability: getAcceptability(riskLevel),
    }
  })

export function MatrixEditor({ matrix }: MatrixEditorProps) {
  const updateMatrixRows = useMatrixStore((state) => state.updateMatrixRows)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [dialog, setDialog] = useState<DialogMode>(null)

  const form = useForm<MatrixFormValues>({
    resolver: zodResolver(matrixFormSchema),
    defaultValues: toFormValues(matrix.rows),
  })

  const { control, handleSubmit, reset, formState } = form

  const fieldArray = useFieldArray({
    control,
    name: 'rows',
    keyName: 'fieldId',
  })

  useEffect(() => {
    reset(toFormValues(matrix.rows))
    setDialog(null)
  }, [matrix.id, matrix.rows, reset])

  const onSubmit = (values: MatrixFormValues) => {
    updateMatrixRows(matrix.id, toStoredRows(values))
  }

  const handleSaveRow = (values: MatrixRowFormValues) => {
    if (!dialog) return
    if (dialog.kind === 'new') {
      fieldArray.append(values)
    } else {
      fieldArray.update(dialog.index, values)
    }
    setDialog(null)
  }

  const initialDialogValues = useMemo<MatrixRowFormValues>(() => {
    if (!dialog) return blankRow()
    if (dialog.kind === 'new') return blankRow()
    return form.getValues(`rows.${dialog.index}`) ?? blankRow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-1 border-b border-slate-200">
        <ViewTab
          active={viewMode === 'table'}
          onClick={() => setViewMode('table')}
        >
          Editor (tabla)
        </ViewTab>
        <ViewTab
          active={viewMode === 'heatmap'}
          onClick={() => setViewMode('heatmap')}
        >
          Mapa de calor
        </ViewTab>
      </div>

      <p className="text-xs text-slate-500">
        {viewMode === 'table'
          ? 'Cada fila es una actividad. Usa "Editar" para abrir el formulario completo, o "+ Agregar actividad" para crear una nueva.'
          : 'Vista visual tipo Excel: cada celda muestra el Nivel de Riesgo (Probabilidad × Consecuencia) coloreado por aceptabilidad. La burbuja indica cuántas actividades caen en esa celda.'}
      </p>

      {viewMode === 'heatmap' ? (
        <>
          <MatrixHeatmap control={control} />
          {formState.isDirty && (
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-amber-600">Cambios sin guardar</span>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Guardar matriz
              </button>
            </div>
          )}
        </>
      ) : (
        <TableView
          form={form}
          fieldArray={fieldArray}
          onAdd={() => setDialog({ kind: 'new' })}
          onEdit={(index) => setDialog({ kind: 'edit', index })}
        />
      )}

      {dialog && (
        <MatrixRowDialog
          title={
            dialog.kind === 'new'
              ? 'Nueva actividad'
              : `Editar actividad ${dialog.index + 1}`
          }
          initialValues={initialDialogValues}
          onSave={handleSaveRow}
          onClose={() => setDialog(null)}
        />
      )}
    </form>
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

type FieldArrayHandle = Pick<
  UseFieldArrayReturn<MatrixFormValues, 'rows', 'fieldId'>,
  'fields' | 'append' | 'insert' | 'remove'
>

interface TableViewProps {
  form: UseFormReturn<MatrixFormValues>
  fieldArray: FieldArrayHandle
  onAdd: () => void
  onEdit: (index: number) => void
}

function TableView({ form, fieldArray, onAdd, onEdit }: TableViewProps) {
  const { control, formState } = form
  const { fields, insert, remove } = fieldArray

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-10 px-3 py-2">#</th>
              <th className="px-3 py-2">Actividad y peligro</th>
              <th className="px-3 py-2">Controles</th>
              <th className="w-32 px-3 py-2">Probabilidad</th>
              <th className="w-32 px-3 py-2">Consecuencia</th>
              <th className="w-44 px-3 py-2">Nivel</th>
              <th className="w-44 px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                  Aún no hay actividades registradas.{' '}
                  <button
                    type="button"
                    onClick={onAdd}
                    className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
                  >
                    Agrega la primera actividad
                  </button>
                  .
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <RowSummary
                  key={field.fieldId}
                  control={control}
                  index={index}
                  onEdit={() => onEdit(index)}
                  onDuplicate={() => {
                    const current = form.getValues(`rows.${index}`)
                    insert(index + 1, { ...current, id: newId() })
                  }}
                  onDelete={() => remove(index)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onAdd}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          + Agregar actividad
        </button>

        <div className="flex items-center gap-2">
          {formState.isDirty && (
            <span className="text-xs text-amber-600">Cambios sin guardar</span>
          )}
          <button
            type="submit"
            disabled={!formState.isDirty || formState.isSubmitting}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            Guardar matriz
          </button>
        </div>
      </div>
    </>
  )
}

interface RowSummaryProps {
  control: Control<MatrixFormValues>
  index: number
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function RowSummary({ control, index, onEdit, onDuplicate, onDelete }: RowSummaryProps) {
  const row = useWatch({ control, name: `rows.${index}` }) as
    | MatrixRowFormValues
    | undefined

  if (!row) return null

  const np = Number(row.probability) || 0
  const nc = Number(row.consequence) || 0
  const level = computeRiskLevel(np, nc)
  const acceptability = getAcceptability(level)

  const isEmpty = !row.activity?.trim() && !row.hazard?.trim()

  return (
    <tr className="align-top hover:bg-slate-50/60">
      <td className="px-3 py-3 text-xs text-slate-400">{index + 1}</td>
      <td className="px-3 py-3">
        {isEmpty ? (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm italic text-amber-600 underline underline-offset-2 hover:text-amber-700"
          >
            Sin información — haz clic en Editar
          </button>
        ) : (
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-slate-800">
              {row.activity || '(sin nombre)'}
            </p>
            <p className="text-xs text-slate-500">{row.hazard}</p>
          </div>
        )}
      </td>
      <td className="px-3 py-3">
        <ControlsSummary controls={row.controls} />
      </td>
      <td className="px-3 py-3 text-sm text-slate-700">
        {labelFor(PROBABILITY_OPTIONS, row.probability)}
      </td>
      <td className="px-3 py-3 text-sm text-slate-700">
        {labelFor(CONSEQUENCE_OPTIONS, row.consequence)}
      </td>
      <td className="px-3 py-3">
        <AcceptabilityBadge acceptability={acceptability} riskLevel={level} />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            Duplicar
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}

interface ControlsSummaryProps {
  controls: MatrixRowFormValues['controls']
}

function ControlsSummary({ controls }: ControlsSummaryProps) {
  const items: Array<{ key: keyof MatrixRowFormValues['controls']; short: string }> = [
    { key: 'engineering', short: 'Ing' },
    { key: 'administrative', short: 'Adm' },
    { key: 'ppe', short: 'EPP' },
  ]
  return (
    <div className="flex flex-wrap gap-1">
      {items.map(({ key, short }) => {
        const value = controls?.[key]?.trim() ?? ''
        const filled = value.length > 0
        return (
          <span
            key={key}
            title={filled ? value : `Sin control ${short}`}
            className={
              filled
                ? 'inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700'
                : 'inline-flex items-center gap-1 rounded-md border border-dashed border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-400'
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${filled ? 'bg-emerald-500' : 'bg-slate-300'}`}
            />
            {short}
          </span>
        )
      })}
    </div>
  )
}

const labelFor = (options: readonly ScaleOption[], value: number): string =>
  options.find((option) => option.value === value)?.label ?? `${value}`
