import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProcessStore } from '@/core/stores/useProcessStore'

const schema = z.object({
  name: z.string().min(1),
  sector: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 aria-[invalid=true]:border-red-400'

export function CreateClientForm() {
  const createClient = useProcessStore((state) => state.createClient)
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', sector: '' },
  })

  const onSubmit = (values: FormValues) => {
    createClient(values)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <header>
        <h2 className="text-lg font-semibold text-slate-800">Crear cliente</h2>
        <p className="text-sm text-slate-500">
          Registra el cliente o negocio que vas a auditar. Se creará un proceso
          de ejemplo automáticamente para que veas el flujo.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Nombre
          </span>
          <input
            type="text"
            required
            aria-invalid={Boolean(formState.errors.name)}
            className={inputClass}
            {...register('name')}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Sector
          </span>
          <input
            type="text"
            required
            aria-invalid={Boolean(formState.errors.sector)}
            className={inputClass}
            {...register('sector')}
          />
        </label>
      </div>

      <button
        type="submit"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        disabled={formState.isSubmitting}
      >
        Crear cliente
      </button>
    </form>
  )
}
