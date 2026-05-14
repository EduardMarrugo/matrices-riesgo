import { z } from 'zod'
import type { ProcessEntity, UnifiedActivity } from '@/core/types/process'
import { computeRiskLevel, getAcceptability } from '@/core/utils/risk'
import { newId } from '@/core/utils/id'

const sharedControlsSchema = z.object({
  engineering: z.string(),
  administrative: z.string(),
  ppe: z.string(),
})

const importedActivitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().default(''),
  responsibleRole: z.string().default(''),
  controls: sharedControlsSchema,
  sst: z.object({
    hazardType: z.string().default('Otros'),
    hazardDescription: z.string().min(1),
    effects: z.string().default(''),
    probability: z.number().positive(),
    consequence: z.number().positive(),
    isPriority: z.boolean().default(false),
  }),
  maso: z.object({
    aspect: z.string().default(''),
    impact: z.string().default(''),
    probability: z.number().positive(),
    consequence: z.number().positive(),
    isSignificant: z.boolean().default(false),
  }),
})

const importedProcessSchema = z.object({
  processName: z.string().optional(),
  exportedAt: z.string().optional(),
  description: z.string().optional(),
  owner: z.string().optional(),
  activities: z.array(importedActivitySchema),
})

export interface ProcessExportPayload {
  processName: string
  description: string
  owner: string
  exportedAt: string
  activities: UnifiedActivity[]
}

export const buildExportPayload = (process: ProcessEntity): ProcessExportPayload => ({
  processName: process.name,
  description: process.description,
  owner: process.owner,
  exportedAt: new Date().toISOString(),
  activities: process.activities,
})

export const downloadJson = (payload: unknown, filename: string): void => {
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
  return cleaned || 'proceso'
}

export interface ParseResult {
  ok: boolean
  activities?: UnifiedActivity[]
  error?: string
}

export const parseImportedJson = (raw: string): ParseResult => {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'Archivo JSON inválido.' }
  }

  const result = importedProcessSchema.safeParse(json)
  if (!result.success) {
    return {
      ok: false,
      error: 'Estructura no compatible con un proceso SSOT.',
    }
  }

  const activities: UnifiedActivity[] = result.data.activities.map((a) => {
    const sstLevel = computeRiskLevel(a.sst.probability, a.sst.consequence)
    const masoLevel = computeRiskLevel(a.maso.probability, a.maso.consequence)
    return {
      id: a.id ?? newId(),
      name: a.name,
      description: a.description,
      responsibleRole: a.responsibleRole,
      controls: a.controls,
      sst: {
        ...a.sst,
        riskLevel: sstLevel,
        acceptability: getAcceptability(sstLevel),
      },
      maso: {
        ...a.maso,
        riskLevel: masoLevel,
        acceptability: getAcceptability(masoLevel),
      },
    }
  })

  return { ok: true, activities }
}
