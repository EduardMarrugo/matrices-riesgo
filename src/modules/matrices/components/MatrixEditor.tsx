import { useEffect } from 'react'
import { useFieldArray, useForm, useWatch, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { MatrixRow, RiskMatrix } from '@/core/types/matrix'
import { useMatrixStore } from '@/core/stores/useMatrixStore'
import { newId } from '@/core/utils/id'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  computeRiskLevel,
  getAcceptability,
} from '@/core/utils/risk'
import {
  matrixFormSchema,
  type MatrixFormValues,
  type MatrixRowFormValues,
} from '@/modules/matrices/schemas/matrixForm.schema'
import { AcceptabilityBadge } from './AcceptabilityBadge'

interface MatrixEditorProps {
  matrix: RiskMatrix
}

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 aria-[invalid=true]:border-red-400'

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

  const form = useForm<MatrixFormValues>({
    resolver: zodResolver(matrixFormSchema),
    defaultValues: toFormValues(matrix.rows),
  })

  const { control, register, handleSubmit, reset, formState } = form

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'rows',
    keyName: 'fieldId',
  })

  useEffect(() => {
    reset(toFormValues(matrix.rows))
  }, [matrix.id, matrix.rows, reset])

  const onSubmit = (values: MatrixFormValues) => {
    updateMatrixRows(matrix.id, toStoredRows(values))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1200px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-10 px-3 py-2">#</th>
              <th className="w-44 px-3 py-2">Actividad</th>
              <th className="w-48 px-3 py-2">Peligro</th>
              <th className="w-44 px-3 py-2">Ingeniería</th>
              <th className="w-44 px-3 py-2">Administrativos</th>
              <th className="w-40 px-3 py-2">EPP</th>
              <th className="w-32 px-3 py-2">Probabilidad</th>
              <th className="w-32 px-3 py-2">Consecuencia</th>
              <th className="w-44 px-3 py-2">Nivel · Aceptabilidad</th>
              <th className="w-32 px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-sm text-slate-500">
                  Aún no hay actividades registradas. Agrega la primera fila para comenzar.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => (
                <tr key={field.fieldId} className="align-top">
                  <td className="px-3 py-2 text-xs text-slate-400">{index + 1}</td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      required
                      aria-invalid={Boolean(formState.errors.rows?.[index]?.activity)}
                      className={inputClass}
                      {...register(`rows.${index}.activity` as const)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      required
                      aria-invalid={Boolean(formState.errors.rows?.[index]?.hazard)}
                      className={inputClass}
                      {...register(`rows.${index}.hazard` as const)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className={inputClass}
                      {...register(`rows.${index}.controls.engineering` as const)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className={inputClass}
                      {...register(`rows.${index}.controls.administrative` as const)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      className={inputClass}
                      {...register(`rows.${index}.controls.ppe` as const)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className={inputClass}
                      {...register(`rows.${index}.probability` as const, {
                        valueAsNumber: true,
                      })}
                    >
                      {PROBABILITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className={inputClass}
                      {...register(`rows.${index}.consequence` as const, {
                        valueAsNumber: true,
                      })}
                    >
                      {CONSEQUENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <RowRiskBadge control={control} index={index} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const current = form.getValues(`rows.${index}`)
                          insert(index + 1, { ...current, id: newId() })
                        }}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Duplicar
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => append(blankRow())}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
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
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            Guardar matriz
          </button>
        </div>
      </div>
    </form>
  )
}

interface RowRiskBadgeProps {
  control: Control<MatrixFormValues>
  index: number
}

function RowRiskBadge({ control, index }: RowRiskBadgeProps) {
  const probability = useWatch({ control, name: `rows.${index}.probability` })
  const consequence = useWatch({ control, name: `rows.${index}.consequence` })

  const np = Number(probability) || 0
  const nc = Number(consequence) || 0
  const riskLevel = computeRiskLevel(np, nc)
  const acceptability = getAcceptability(riskLevel)

  return <AcceptabilityBadge acceptability={acceptability} riskLevel={riskLevel} />
}
