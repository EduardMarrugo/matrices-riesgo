import type { Indicator, MonthValues } from '@/core/types/indicator'
import { MONTH_LABELS } from '@/core/utils/indicatorCatalog'
import { useIndicatorStore } from '@/core/stores/useIndicatorStore'
import { sumMonths } from '@/modules/indicators/utils/summary'

interface IndicatorTableProps {
  indicator: Indicator
}

export function IndicatorTable({ indicator }: IndicatorTableProps) {
  const updateIndicatorMonth = useIndicatorStore(
    (state) => state.updateIndicatorMonth,
  )

  const handleChange = (
    monthIndex: number,
    field: keyof MonthValues,
    raw: string,
  ) => {
    const value = raw === '' ? 0 : Number(raw)
    if (Number.isNaN(value)) return
    updateIndicatorMonth(indicator.id, monthIndex, { [field]: value })
  }

  const totalMeta = sumMonths(indicator, 'meta')
  const totalReal = sumMonths(indicator, 'real')

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] table-fixed text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="w-20 px-3 py-2"> </th>
            {MONTH_LABELS.map((label) => (
              <th key={label} className="w-12 px-2 py-2 text-center">
                {label}
              </th>
            ))}
            <th className="w-16 px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <Row
            label="Meta"
            indicator={indicator}
            field="meta"
            total={totalMeta}
            onChange={handleChange}
          />
          <Row
            label="Real"
            indicator={indicator}
            field="real"
            total={totalReal}
            onChange={handleChange}
            emphasis
          />
        </tbody>
      </table>
    </div>
  )
}

interface RowProps {
  label: string
  indicator: Indicator
  field: keyof MonthValues
  total: number
  emphasis?: boolean
  onChange: (monthIndex: number, field: keyof MonthValues, raw: string) => void
}

function Row({ label, indicator, field, total, emphasis, onChange }: RowProps) {
  return (
    <tr>
      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </th>
      {indicator.months.map((month, index) => (
        <td key={index} className="px-1 py-1">
          <input
            type="number"
            min={0}
            step="any"
            value={month[field] === 0 ? '' : month[field]}
            placeholder="0"
            onChange={(event) => onChange(index, field, event.target.value)}
            className={`w-full rounded-md border border-slate-200 bg-white px-1 py-1 text-center text-sm tabular-nums focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 ${
              emphasis ? 'font-semibold text-slate-800' : 'text-slate-600'
            }`}
          />
        </td>
      ))}
      <td className="px-3 py-2 text-right text-sm font-semibold tabular-nums text-slate-700">
        {total}
      </td>
    </tr>
  )
}
