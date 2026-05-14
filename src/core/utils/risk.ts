import type { Acceptability } from '@/core/types/process'

export interface ScaleOption {
  value: number
  label: string
}

export const PROBABILITY_OPTIONS: readonly ScaleOption[] = [
  { value: 2, label: 'Baja (2)' },
  { value: 6, label: 'Media (6)' },
  { value: 10, label: 'Alta (10)' },
  { value: 24, label: 'Muy alta (24)' },
  { value: 40, label: 'Crítica (40)' },
]

export const CONSEQUENCE_OPTIONS: readonly ScaleOption[] = [
  { value: 10, label: 'Leve (10)' },
  { value: 25, label: 'Grave (25)' },
  { value: 60, label: 'Muy grave (60)' },
  { value: 100, label: 'Mortal (100)' },
]

export const computeRiskLevel = (
  probability: number,
  consequence: number,
): number => probability * consequence

export const getAcceptability = (riskLevel: number): Acceptability => {
  if (riskLevel >= 200) return 'critical'
  if (riskLevel <= 40) return 'acceptable'
  return 'tolerable'
}

interface AcceptabilityMeta {
  label: string
  badge: string
  dot: string
}

export const ACCEPTABILITY_META: Record<Acceptability, AcceptabilityMeta> = {
  acceptable: {
    label: 'Aceptable',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  tolerable: {
    label: 'Tolerable',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  critical: {
    label: 'No aceptable',
    badge: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-500',
  },
}
