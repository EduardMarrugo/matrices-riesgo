import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  computeRiskLevel,
  getAcceptability,
} from '@/core/utils/risk'
import {
  matrixRowSchema,
  type MatrixRowFormValues,
} from '@/modules/matrices/schemas/matrixForm.schema'
import { AcceptabilityBadge } from './AcceptabilityBadge'

interface MatrixRowDialogProps {
  title: string
  initialValues: MatrixRowFormValues
  onSave: (values: MatrixRowFormValues) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 aria-[invalid=true]:border-red-400'

const textareaClass = `${inputClass} resize-y min-h-[68px]`

export function MatrixRowDialog({
  title,
  initialValues,
  onSave,
  onClose,
}: MatrixRowDialogProps) {
  const { register, handleSubmit, control, formState } = useForm<MatrixRowFormValues>({
    resolver: zodResolver(matrixRowSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  const onSubmit = (values: MatrixRowFormValues) => {
    onSave(values)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-900/50"
      />
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <span aria-hidden>×</span>
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-6">
              <Section title="Identificación">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Actividad" required error={formState.errors.activity}>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Trabajo en alturas"
                      aria-invalid={Boolean(formState.errors.activity)}
                      className={inputClass}
                      {...register('activity')}
                    />
                  </Field>
                  <Field label="Peligro" required error={formState.errors.hazard}>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Caída a distinto nivel"
                      aria-invalid={Boolean(formState.errors.hazard)}
                      className={inputClass}
                      {...register('hazard')}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="Jerarquía de controles"
                description="Describe los controles existentes o propuestos. Puedes dejar campos vacíos."
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Ingeniería">
                    <textarea
                      placeholder="Líneas de vida, ventilación, barandas…"
                      className={textareaClass}
                      {...register('controls.engineering')}
                    />
                  </Field>
                  <Field label="Administrativos">
                    <textarea
                      placeholder="Permisos, capacitaciones, procedimientos…"
                      className={textareaClass}
                      {...register('controls.administrative')}
                    />
                  </Field>
                  <Field label="EPP">
                    <textarea
                      placeholder="Arnés, casco, guantes, respirador…"
                      className={textareaClass}
                      {...register('controls.ppe')}
                    />
                  </Field>
                </div>
              </Section>

              <Section
                title="Valoración del riesgo"
                description="El nivel de riesgo se calcula como Probabilidad × Consecuencia."
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Probabilidad">
                    <select
                      className={inputClass}
                      {...register('probability', { valueAsNumber: true })}
                    >
                      {PROBABILITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Consecuencia">
                    <select
                      className={inputClass}
                      {...register('consequence', { valueAsNumber: true })}
                    >
                      {CONSEQUENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Nivel · Aceptabilidad">
                    <div className="flex h-[38px] items-center rounded-md border border-slate-200 bg-slate-50 px-3">
                      <RiskPreview control={control} />
                    </div>
                  </Field>
                </div>
              </Section>
            </div>
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              disabled={formState.isSubmitting}
            >
              Guardar actividad
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-3">
      <header>
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </header>
      {children}
    </section>
  )
}

interface FieldProps {
  label: string
  required?: boolean
  error?: { message?: string }
  children: React.ReactNode
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {error?.message && (
        <span className="mt-1 block text-xs text-red-600">{error.message}</span>
      )}
    </label>
  )
}

function RiskPreview({
  control,
}: {
  control: ReturnType<typeof useForm<MatrixRowFormValues>>['control']
}) {
  const probability = useWatch({ control, name: 'probability' })
  const consequence = useWatch({ control, name: 'consequence' })
  const np = Number(probability) || 0
  const nc = Number(consequence) || 0
  const level = computeRiskLevel(np, nc)
  const acceptability = getAcceptability(level)
  return <AcceptabilityBadge acceptability={acceptability} riskLevel={level} />
}
