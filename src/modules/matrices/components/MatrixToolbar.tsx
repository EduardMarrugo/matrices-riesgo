import { useRef, useState } from 'react'
import type { RiskMatrix } from '@/core/types/matrix'
import { useMatrixStore } from '@/core/stores/useMatrixStore'
import {
  buildExportPayload,
  downloadJson,
  parseImportedJson,
  slugify,
} from '@/modules/matrices/utils/io'

interface MatrixToolbarProps {
  matrix: RiskMatrix
}

export function MatrixToolbar({ matrix }: MatrixToolbarProps) {
  const updateMatrixRows = useMatrixStore((state) => state.updateMatrixRows)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<{
    kind: 'success' | 'error'
    message: string
  } | null>(null)

  const handleExport = () => {
    const payload = buildExportPayload(matrix)
    const filename = `${slugify(matrix.name)}-${matrix.id.slice(0, 8)}.json`
    downloadJson(payload, filename)
    setFeedback({ kind: 'success', message: 'Matriz exportada.' })
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

    if (!result.ok || !result.rows) {
      setFeedback({
        kind: 'error',
        message: result.error ?? 'No se pudo importar el archivo.',
      })
      return
    }

    if (
      matrix.rows.length > 0 &&
      !window.confirm(
        'Esta matriz ya tiene filas registradas. ¿Reemplazarlas con las del archivo?',
      )
    ) {
      return
    }

    updateMatrixRows(matrix.id, result.rows)
    setFeedback({
      kind: 'success',
      message: `Importadas ${result.rows.length} filas.`,
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
