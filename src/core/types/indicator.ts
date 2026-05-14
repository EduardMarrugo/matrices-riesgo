export type IndicatorKind = 'reactive' | 'proactive'
export type GoalDirection = 'higher' | 'lower'

export interface MonthValues {
  meta: number
  real: number
}

export interface Indicator {
  id: string
  clientId: string
  kind: IndicatorKind
  name: string
  unit: string
  goalDirection: GoalDirection
  months: MonthValues[]
  updatedAt: string
}
