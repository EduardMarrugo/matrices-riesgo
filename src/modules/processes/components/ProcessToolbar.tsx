import { useRef, useState } from 'react'
import type { ProcessEntity } from '@/core/types/process'
import { useProcessStore } from '@/core/stores/useProcessStore'
import {
  buildExportPayload,
  downloadJson,
  parseImportedJson,
  slugify,
} from '@/modules/processes/utils/io'

interface ProcessToolbarProps {
  process: ProcessEntity
}

export function ProcessToolbar({ process }: ProcessToolbarProps) {
  const updateActivities = useProcessStore((state) => state.updateActivities)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<{
    kind: 'success' | 'error'
    message: string
  } | null>(null)

  const handleExport = () => {
    const payload = buildExportPayload(process)
    const filename = `${slugify(process.name)}-${process.id.slice(0, 8)}.json`
    downloadJson(payload, filename)
    setFeedback({ kind: 'success', message: 'Proceso exportado.' })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const text = await file.text()
    const result = parseImportedJson(text)

    if (!result.ok || !result.activities) {
      setFeedback({
        kind: 'error',
        message: result.error ?? 'No se pudo importar el archivo.',
      })
      return
    }

    if (
      process.activities.length > 0 &&
      !window.confirm(
        'Este proceso ya tiene actividades. ¿Reemplazarlas con las del archivo?',
      )
    ) {
      return
    }

    updateActivities(process.id, result.activities)
    setFeedback({
      kind: 'success',
      message: `Importadas ${result.activities.length} actividades.`,
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        Exportar JSON
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        Importar JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFile}
        className="hidden"
      />
      {feedback && (
        <span
          role="status"
          className={`text-xs ${
            feedback.kind === 'success' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {feedback.message}
        </span>
      )}
    </div>
  )
}
