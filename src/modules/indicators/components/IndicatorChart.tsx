import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Indicator } from '@/core/types/indicator'
import { MONTH_LABELS } from '@/core/utils/indicatorCatalog'

interface IndicatorChartProps {
  indicator: Indicator
}

export function IndicatorChart({ indicator }: IndicatorChartProps) {
  let cumulativeReal = 0
  const data = indicator.months.map((month, index) => {
    cumulativeReal += month.real
    return {
      month: MONTH_LABELS[index],
      meta: month.meta,
      real: month.real,
      acumulado: cumulativeReal,
    }
  })

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 6,
              border: '1px solid #e2e8f0',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="meta" fill="#cbd5e1" name="Meta" />
          <Bar dataKey="real" fill="#0f172a" name="Real" />
          <Line
            type="monotone"
            dataKey="acumulado"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            name="Real acumulado"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
