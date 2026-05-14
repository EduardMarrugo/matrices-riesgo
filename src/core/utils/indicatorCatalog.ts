import type { GoalDirection, IndicatorKind } from '@/core/types/indicator'

export interface IndicatorTemplate {
  kind: IndicatorKind
  name: string
  unit: string
  goalDirection: GoalDirection
}

export const INDICATOR_CATALOG: readonly IndicatorTemplate[] = [
  { kind: 'reactive', name: 'Lesiones incapacitantes', unit: 'casos', goalDirection: 'lower' },
  { kind: 'reactive', name: 'Primeros auxilios', unit: 'casos', goalDirection: 'lower' },
  { kind: 'reactive', name: 'Daños a la propiedad', unit: 'casos', goalDirection: 'lower' },
  { kind: 'proactive', name: 'Observaciones de tarea', unit: '%', goalDirection: 'higher' },
  { kind: 'proactive', name: 'Inspecciones de seguridad', unit: 'inspecciones', goalDirection: 'higher' },
  { kind: 'proactive', name: 'Estado de equipos', unit: '%', goalDirection: 'higher' },
]

export const MONTH_LABELS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
] as const

export const buildEmptyMonths = () =>
  Array.from({ length: 12 }, () => ({ meta: 0, real: 0 }))
