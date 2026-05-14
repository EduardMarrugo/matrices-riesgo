import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Indicator, MonthValues } from '@/core/types/indicator'
import { newId } from '@/core/utils/id'
import { nowIso } from '@/core/utils/date'
import {
  INDICATOR_CATALOG,
  buildEmptyMonths,
} from '@/core/utils/indicatorCatalog'

interface IndicatorState {
  indicators: Indicator[]
}

interface IndicatorActions {
  ensureIndicatorsForClient: (clientId: string) => void
  updateIndicatorMonth: (
    indicatorId: string,
    monthIndex: number,
    values: Partial<MonthValues>,
  ) => void
}

type IndicatorStore = IndicatorState & IndicatorActions

const STORE_NAME = 'sgsst-indicator-store'

export const useIndicatorStore = create<IndicatorStore>()(
  persist(
    (set, get) => ({
      indicators: [],

      ensureIndicatorsForClient: (clientId) => {
        const existing = get().indicators.some(
          (indicator) => indicator.clientId === clientId,
        )
        if (existing) return

        const seeded: Indicator[] = INDICATOR_CATALOG.map((template) => ({
          id: newId(),
          clientId,
          kind: template.kind,
          name: template.name,
          unit: template.unit,
          goalDirection: template.goalDirection,
          months: buildEmptyMonths(),
          updatedAt: nowIso(),
        }))

        set((state) => ({ indicators: [...state.indicators, ...seeded] }))
      },

      updateIndicatorMonth: (indicatorId, monthIndex, values) => {
        set((state) => ({
          indicators: state.indicators.map((indicator) => {
            if (indicator.id !== indicatorId) return indicator
            const months = indicator.months.map((month, idx) =>
              idx === monthIndex ? { ...month, ...values } : month,
            )
            return { ...indicator, months, updatedAt: nowIso() }
          }),
        }))
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
