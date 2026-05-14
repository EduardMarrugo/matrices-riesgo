import type { Indicator } from '@/core/types/indicator'

export const sumMonths = (indicator: Indicator, key: 'meta' | 'real'): number =>
  indicator.months.reduce((acc, month) => acc + month[key], 0)

export interface ClientIndicatorSummary {
  reactiveTotal: number
  reactiveCount: number
  proactiveCompliance: number | null
  totalIndicators: number
}

export const summarizeForClient = (indicators: Indicator[]): ClientIndicatorSummary => {
  const reactive = indicators.filter((i) => i.kind === 'reactive')
  const proactive = indicators.filter((i) => i.kind === 'proactive')

  const reactiveTotal = reactive.reduce(
    (acc, indicator) => acc + sumMonths(indicator, 'real'),
    0,
  )

  const proactiveRatios = proactive
    .map((indicator) => {
      const meta = sumMonths(indicator, 'meta')
      if (meta <= 0) return null
      const real = sumMonths(indicator, 'real')
      return Math.min(real / meta, 1.5)
    })
    .filter((value): value is number => value !== null)

  const proactiveCompliance =
    proactiveRatios.length === 0
      ? null
      : proactiveRatios.reduce((acc, value) => acc + value, 0) / proactiveRatios.length

  return {
    reactiveTotal,
    reactiveCount: reactive.length,
    proactiveCompliance,
    totalIndicators: indicators.length,
  }
}
