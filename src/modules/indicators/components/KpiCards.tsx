import type { ClientIndicatorSummary } from '@/modules/indicators/utils/summary'

interface KpiCardsProps {
  summary: ClientIndicatorSummary
}

export function KpiCards({ summary }: KpiCardsProps) {
  const compliancePct =
    summary.proactiveCompliance === null
      ? '—'
      : `${Math.round(summary.proactiveCompliance * 100)}%`

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        label="Cumplimiento controles proactivos"
        value={compliancePct}
        hint="Promedio Real / Meta"
      />
      <Card
        label="Eventos reactivos YTD"
        value={summary.reactiveTotal.toString()}
        hint={`${summary.reactiveCount} indicadores reactivos`}
        tone={summary.reactiveTotal > 0 ? 'warn' : 'ok'}
      />
      <Card
        label="Indicadores monitoreados"
        value={summary.totalIndicators.toString()}
        hint="Catálogo SGSST activo"
      />
    </div>
  )
}

interface CardProps {
  label: string
  value: string
  hint?: string
  tone?: 'ok' | 'warn'
}

function Card({ label, value, hint, tone }: CardProps) {
  const valueColor =
    tone === 'warn'
      ? 'text-amber-600'
      : tone === 'ok'
        ? 'text-emerald-600'
        : 'text-slate-800'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${valueColor}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
