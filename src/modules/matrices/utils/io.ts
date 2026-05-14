import { z } from 'zod'
import type { MatrixRow, RiskMatrix } from '@/core/types/matrix'
import { computeRiskLevel, getAcceptability } from '@/core/utils/risk'

const importedRowSchema = z.object({
  id: z.string().optional(),
  activity: z.string().min(1),
  hazard: z.string().min(1),
  controls: z.object({
    engineering: z.string(),
    administrative: z.string(),
    ppe: z.string(),
  }),
  probability: z.number().positive(),
  consequence: z.number().positive(),
})

const importedMatrixSchema = z.object({
  matrixName: z.string().optional(),
  exportedAt: z.string().optional(),
  rows: z.array(importedRowSchema),
})

export interface MatrixExportPayload {
  matrixName: string
  exportedAt: string
  rows: MatrixRow[]
}

export const buildExportPayload = (matrix: RiskMatrix): MatrixExportPayload => ({
  matrixName: matrix.name,
  exportedAt: new Date().toISOString(),
  rows: matrix.rows,
})

export const downloadJson = (payload: MatrixExportPayload, filename: string): void => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export const slugify = (value: string): string => {
  const cleaned = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return cleaned || 'matriz'
}

const buildIdFactory = () => {
  let counter = 0
  return () => `${Date.now()}-${(counter++).toString(36)}`
}

export interface ParseResult {
  ok: boolean
  rows?: MatrixRow[]
  error?: string
}

export const parseImportedJson = (raw: string): ParseResult => {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'Archivo JSON inválido.' }
  }

  const result = importedMatrixSchema.safeParse(json)
  if (!result.success) {
    return { ok: false, error: 'Estructura no compatible con una matriz IPEVAR.' }
  }

  const nextId = buildIdFactory()
  const rows: MatrixRow[] = result.data.rows.map((row) => {
    const riskLevel = computeRiskLevel(row.probability, row.consequence)
    return {
      id: row.id ?? nextId(),
      activity: row.activity,
      hazard: row.hazard,
      controls: row.controls,
      probability: row.probability,
      consequence: row.consequence,
      riskLevel,
      acceptability: getAcceptability(riskLevel),
    }
  })

  return { ok: true, rows }
}
