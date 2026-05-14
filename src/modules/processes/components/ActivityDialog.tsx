import { useEffect, useState, type ReactNode } from 'react'
import { useForm, useWatch, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CONSEQUENCE_OPTIONS,
  PROBABILITY_OPTIONS,
  computeRiskLevel,
  getAcceptability,
} from '@/core/utils/risk'
import { HAZARD_TYPES, MASO_ASPECT_TYPES } from '@/core/utils/processCatalog'
import {
  activityFormSchema,
  type ActivityFormValues,
} from '@/modules/processes/schemas/activity.schema'
import { AcceptabilityBadge } from './AcceptabilityBadge'

type DialogTab = 'sst' | 'maso' | 'controls'

interface ActivityDialogProps {
  title: string
  initialValues: ActivityFormValues
  onSave: (values: ActivityFormValues) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 aria-[invalid=true]:border-red-400'

const textareaClass = `${inputClass} resize-y min-h-[68px]`

export function ActivityDialog({
  title,
  initialValues,
  onSave,
  onClose,
}: ActivityDialogProps) {
  const [tab, setTab] = useState<DialogTab>('sst')
  const { register, handleSubmit, control, formState } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
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

  const onSubmit = (values: ActivityFormValues) => {
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
      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
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
          <div className="flex-1 overflow-y-auto">
            <section className="space-y-4 px-6 py-5">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Identificación
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Actividad" required error={formState.errors.name}>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Trabajo en alturas"
                    aria-invalid={Boolean(formState.errors.name)}
                    className={inputClass}
                    {...register('name')}
                  />
                </Field>
                <Field label="Responsable">
                  <input
                    type="text"
                    placeholder="Ej. Técnico de alturas"
                    className={inputClass}
                    {...register('responsibleRole')}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Descripción">
                    <textarea
                      placeholder="Breve descripción de la actividad…"
                      className={textareaClass}
                      {...register('description')}
                    />
                  </Field>
                </div>
              </div>
            </section>

            <div className="border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1 px-6 pt-3">
                <DialogTabButton active={tab === 'sst'} onClick={() => setTab('sst')}>
                  SST
                </DialogTabButton>
                <DialogTabButton active={tab === 'maso'} onClick={() => setTab('maso')}>
                  MASO
                </DialogTabButton>
                <DialogTabButton
                  active={tab === 'controls'}
                  onClick={() => setTab('controls')}
                >
                  Controles compartidos
                </DialogTabButton>
              </div>
            </div>

            <div className="px-6 py-5">
              {tab === 'sst' && <SstTab control={control} register={register} formState={formState} />}
              {tab === 'maso' && <MasoTab control={control} register={register} />}
              {tab === 'controls' && <ControlsTab register={register} />}
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

interface DialogTabButtonProps {
  active: boolean
  onClick: () => void
  children: ReactNode
}

function DialogTabButton({ active, onClick, children }: DialogTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors ${
        active
          ? 'border-slate-900 bg-white font-medium text-slate-900'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

interface FieldProps {
  label: string
  required?: boolean
  error?: { message?: string }
  children: ReactNode
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

interface SstTabProps {
  control: Control<ActivityFormValues>
  register: ReturnType<typeof useForm<ActivityFormValues>>['register']
  formState: ReturnType<typeof useForm<ActivityFormValues>>['formState']
}

function SstTab({ control, register, formState }: SstTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Identificación de Peligros y Valoración de Riesgos (MIP).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de peligro" required error={formState.errors.sst?.hazardType}>
          <select
            required
            className={inputClass}
            aria-invalid={Boolean(formState.errors.sst?.hazardType)}
            {...register('sst.hazardType')}
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {HAZARD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Descripción del peligro"
          required
          error={formState.errors.sst?.hazardDescription}
        >
          <input
            type="text"
            required
            placeholder="Ej. Caída a distinto nivel"
            aria-invalid={Boolean(formState.errors.sst?.hazardDescription)}
            className={inputClass}
            {...register('sst.hazardDescription')}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Efectos posibles">
            <textarea
              placeholder="Ej. Politraumatismos, muerte"
              className={textareaClass}
              {...register('sst.effects')}
            />
          </Field>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Probabilidad">
          <select
            className={inputClass}
            {...register('sst.probability', { valueAsNumber: true })}
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
            {...register('sst.consequence', { valueAsNumber: true })}
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
            <RiskPreview
              control={control}
              probabilityName="sst.probability"
              consequenceName="sst.consequence"
            />
          </div>
        </Field>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          {...register('sst.isPriority')}
        />
        Marcar como peligro prioritario
      </label>
    </div>
  )
}

interface MasoTabProps {
  control: Control<ActivityFormValues>
  register: ReturnType<typeof useForm<ActivityFormValues>>['register']
}

function MasoTab({ control, register }: MasoTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Matriz de Aspectos e Impactos Ambientales (MASO).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Aspecto ambiental">
          <select className={inputClass} {...register('maso.aspect')}>
            <option value="">Sin aspecto</option>
            {MASO_ASPECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Impacto ambiental">
          <input
            type="text"
            placeholder="Ej. Contaminación de fuentes hídricas"
            className={inputClass}
            {...register('maso.impact')}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Probabilidad">
          <select
            className={inputClass}
            {...register('maso.probability', { valueAsNumber: true })}
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
            {...register('maso.consequence', { valueAsNumber: true })}
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
            <RiskPreview
              control={control}
              probabilityName="maso.probability"
              consequenceName="maso.consequence"
            />
          </div>
        </Field>
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          {...register('maso.isSignificant')}
        />
        Marcar como aspecto significativo
      </label>
    </div>
  )
}

interface ControlsTabProps {
  register: ReturnType<typeof useForm<ActivityFormValues>>['register']
}

function ControlsTab({ register }: ControlsTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Estos controles son <strong>compartidos</strong> entre las vistas SST y
        MASO. Editar aquí impacta en ambas evaluaciones automáticamente.
      </p>
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
    </div>
  )
}

interface RiskPreviewProps {
  control: Control<ActivityFormValues>
  probabilityName: 'sst.probability' | 'maso.probability'
  consequenceName: 'sst.consequence' | 'maso.consequence'
}

function RiskPreview({ control, probabilityName, consequenceName }: RiskPreviewProps) {
  const probability = useWatch({ control, name: probabilityName })
  const consequence = useWatch({ control, name: consequenceName })
  const np = Number(probability) || 0
  const nc = Number(consequence) || 0
  const level = computeRiskLevel(np, nc)
  const acceptability = getAcceptability(level)
  return <AcceptabilityBadge acceptability={acceptability} riskLevel={level} />
}
