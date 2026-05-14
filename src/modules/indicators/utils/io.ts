import type { Indicator } from '@/core/types/indicator'
import { downloadJson, slugify } from '@/modules/matrices/utils/io'

interface IndicatorExportPayload {
  clientId: string
  exportedAt: string
  indicators: Indicator[]
}

export const exportIndicatorsForClient = (
  clientName: string,
  clientId: string,
  indicators: Indicator[],
): void => {
  const payload: IndicatorExportPayload = {
    clientId,
    exportedAt: new Date().toISOString(),
    indicators,
  }
  downloadJson(payload, `indicadores-${slugify(clientName)}.json`)
}
