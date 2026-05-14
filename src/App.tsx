import { MainLayout } from '@/components/layout/MainLayout'

export default function App() {
  return (
    <MainLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Bienvenido al Constructor de Matrices IPEVAR
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Selecciona un cliente activo en la barra lateral para comenzar a
          gestionar matrices de riesgo laboral.
        </p>
      </section>
    </MainLayout>
  )
}
