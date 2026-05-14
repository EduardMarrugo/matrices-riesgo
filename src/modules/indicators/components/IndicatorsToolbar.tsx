import type { Client } from '@/core/types/matrix'
import type { Indicator } from '@/core/types/indicator'
import { exportIndicatorsForClient } from '@/modules/indicators/utils/io'

interface IndicatorsToolbarProps {
  client: Client
  indicators: Indicator[]
}

export function IndicatorsToolbar({ client, indicators }: IndicatorsToolbarProps) {
  const handleExport = () => {
    exportIndicatorsForClient(client.name, client.id, indicators)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        disabled={indicators.length === 0}
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Exportar JSON
      </button>
    </div>
  )
}
