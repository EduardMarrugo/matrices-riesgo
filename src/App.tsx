import { MainLayout } from '@/components/layout/MainLayout'
import { useUiStore } from '@/core/stores/useUiStore'
import { ProcessBuilder } from '@/modules/processes/components/ProcessBuilder'
import { IndicatorsDashboard } from '@/modules/indicators/components/IndicatorsDashboard'

export default function App() {
  const activeView = useUiStore((state) => state.activeView)

  return (
    <MainLayout>
      {activeView === 'matrices' ? <ProcessBuilder /> : <IndicatorsDashboard />}
    </MainLayout>
  )
}
