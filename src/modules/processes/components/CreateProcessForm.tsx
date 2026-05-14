import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProcessStore } from '@/core/stores/useProcessStore'

const schema = z.object({
  name: z.string().min(1),
  owner: z.string(),
  description: z.string(),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 aria-[invalid=true]:border-red-400'

interface CreateProcessFormProps {
  clientId: string
}

export function CreateProcessForm({ clientId }: CreateProcessFormProps) {
  const createProcess = useProcessStore((state) => state.createProcess)
  const createDemoProcess = useProcessStore((state) => state.createDemoProcess)
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', owner: '', description: '' },
  })

  const onSubmit = (values: FormValues) => {
    createProcess({ clientId, ...values })
    reset()
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 sm:grid-cols-2"
      >
        <label className="block sm:col-span-1">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Nombre del proceso
          </span>
          <input
            type="text"
            required
            placeholder="Ej. Proceso de mantenimiento"
            aria-invalid={Boolean(formState.errors.name)}
            className={inputClass}
            {...register('name')}
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Responsable
          </span>
          <input
            type="text"
            placeholder="Ej. Líder de operaciones"
            className={inputClass}
            {...register('owner')}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Descripción / objetivo
          </span>
          <textarea
            placeholder="Breve descripción del alcance del proceso…"
            className={`${inputClass} min-h-[60px] resize-y`}
            {...register('description')}
          />
        </label>
        <div className="sm:col-span-2 sm:col-start-2 sm:flex sm:justify-end">
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
            disabled={formState.isSubmitting}
          >
            Crear proceso
          </button>
        </div>
      </form>
      <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>¿No sabes por dónde empezar?</span>
        <button
          type="button"
          onClick={() => createDemoProcess(clientId)}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
        >
          Cargar proceso de ejemplo
        </button>
      </div>
    </div>
  )
}
