import { MainLayout } from '@/components/layout/MainLayout'
import { useUiStore } from '@/core/stores/useUiStore'
import { MatrixBuilder } from '@/modules/matrices/components/MatrixBuilder'
import { IndicatorsDashboard } from '@/modules/indicators/components/IndicatorsDashboard'

export default function App() {
  const activeView = useUiStore((state) => state.activeView)

  return (
    <MainLayout>
      {activeView === 'matrices' ? <MatrixBuilder /> : <IndicatorsDashboard />}
    </MainLayout>
  )
}
