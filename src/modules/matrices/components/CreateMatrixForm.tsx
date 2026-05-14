import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMatrixStore } from '@/core/stores/useMatrixStore'

const schema = z.object({
  name: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

interface CreateMatrixFormProps {
  clientId: string
}

export function CreateMatrixForm({ clientId }: CreateMatrixFormProps) {
  const createMatrix = useMatrixStore((state) => state.createMatrix)
  const createDemoMatrix = useMatrixStore((state) => state.createDemoMatrix)
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })

  const onSubmit = (values: FormValues) => {
    createMatrix({ clientId, name: values.name })
    reset()
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Nombre de la matriz
          </span>
          <input
            type="text"
            required
            aria-invalid={Boolean(formState.errors.name)}
            placeholder="Ej. IPEVAR Sede Bogotá 2026"
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 aria-[invalid=true]:border-red-400"
            {...register('name')}
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          disabled={formState.isSubmitting}
        >
          Crear matriz
        </button>
      </form>
      <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>¿No sabes por dónde empezar?</span>
        <button
          type="button"
          onClick={() => createDemoMatrix(clientId)}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
        >
          Cargar matriz de ejemplo
        </button>
      </div>
    </div>
  )
}
