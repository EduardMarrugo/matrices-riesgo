import { useEffect, useMemo } from 'react'
import { useProcessStore } from '@/core/stores/useProcessStore'
import { useIndicatorStore } from '@/core/stores/useIndicatorStore'
import { summarizeForClient } from '@/modules/indicators/utils/summary'
import { IndicatorChart } from './IndicatorChart'
import { IndicatorTable } from './IndicatorTable'
import { IndicatorsToolbar } from './IndicatorsToolbar'
import { KpiCards } from './KpiCards'

export function IndicatorsDashboard() {
  const activeClient = useProcessStore((state) =>
    state.clients.find((client) => client.id === state.activeClientId) ?? null,
  )
  const indicators = useIndicatorStore((state) => state.indicators)
  const ensureIndicatorsForClient = useIndicatorStore(
    (state) => state.ensureIndicatorsForClient,
  )

  useEffect(() => {
    if (activeClient) ensureIndicatorsForClient(activeClient.id)
  }, [activeClient, ensureIndicatorsForClient])

  const clientIndicators = useMemo(
    () =>
      activeClient
        ? indicators.filter((indicator) => indicator.clientId === activeClient.id)
        : [],
    [indicators, activeClient],
  )

  const summary = useMemo(
    () => summarizeForClient(clientIndicators),
    [clientIndicators],
  )

  if (!activeClient) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Selecciona un cliente
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Para ver el dashboard de indicadores SGSST, primero registra o
          selecciona un cliente desde la barra lateral.
        </p>
      </div>
    )
  }

  const reactive = clientIndicators.filter((i) => i.kind === 'reactive')
  const proactive = clientIndicators.filter((i) => i.kind === 'proactive')

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-semibold text-slate-800">
            Indicadores SGSST · {activeClient.name}
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Seguimiento mensual Ene–Dic. Los datos se guardan automáticamente al
            editar cada celda.
          </p>
        </div>
        <IndicatorsToolbar client={activeClient} indicators={clientIndicators} />
      </header>

      <KpiCards summary={summary} />

      <IndicatorGroup title="Indicadores reactivos" indicators={reactive} />
      <IndicatorGroup title="Indicadores proactivos" indicators={proactive} />
    </div>
  )
}

interface IndicatorGroupProps {
  title: string
  indicators: ReturnType<typeof useIndicatorStore.getState>['indicators']
}

function IndicatorGroup({ title, indicators }: IndicatorGroupProps) {
  if (indicators.length === 0) return null
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {indicators.map((indicator) => (
          <article
            key={indicator.id}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <header className="flex items-baseline justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-800">
                {indicator.name}
              </h4>
              <span className="text-xs text-slate-500">{indicator.unit}</span>
            </header>
            <IndicatorChart indicator={indicator} />
            <IndicatorTable indicator={indicator} />
          </article>
        ))}
      </div>
    </section>
  )
}
