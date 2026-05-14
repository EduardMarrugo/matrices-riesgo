import type { MatrixRow } from '@/core/types/matrix'
import { newId } from './id'
import { computeRiskLevel, getAcceptability } from './risk'

interface DemoTemplate {
  activity: string
  hazard: string
  controls: { engineering: string; administrative: string; ppe: string }
  probability: number
  consequence: number
}

const DEMO_TEMPLATES: readonly DemoTemplate[] = [
  {
    activity: 'Trabajo administrativo en oficina',
    hazard: 'Postura prolongada / riesgo ergonómico',
    controls: {
      engineering: 'Sillas ergonómicas, soporte de monitor',
      administrative: 'Pausas activas cada 2 horas',
      ppe: 'No requiere',
    },
    probability: 6,
    consequence: 10,
  },
  {
    activity: 'Manipulación manual de cargas',
    hazard: 'Sobreesfuerzo, lumbalgia',
    controls: {
      engineering: 'Carretillas y ayudas mecánicas',
      administrative: 'Capacitación en manejo seguro de cargas',
      ppe: 'Faja lumbar, guantes',
    },
    probability: 10,
    consequence: 25,
  },
  {
    activity: 'Manejo de productos químicos',
    hazard: 'Exposición a sustancias peligrosas',
    controls: {
      engineering: 'Ventilación local, contención',
      administrative: 'Hojas de seguridad SDS, capacitación',
      ppe: 'Respirador, guantes nitrilo, gafas',
    },
    probability: 6,
    consequence: 60,
  },
  {
    activity: 'Trabajo en alturas (>1.5 m)',
    hazard: 'Caída a distinto nivel',
    controls: {
      engineering: 'Líneas de vida, barandas, plataformas',
      administrative: 'Permiso de trabajo, supervisión, certificación',
      ppe: 'Arnés de cuerpo entero, casco con barbuquejo',
    },
    probability: 10,
    consequence: 100,
  },
]

export const buildDemoMatrixRows = (): MatrixRow[] =>
  DEMO_TEMPLATES.map((template) => {
    const riskLevel = computeRiskLevel(template.probability, template.consequence)
    return {
      id: newId(),
      ...template,
      riskLevel,
      acceptability: getAcceptability(riskLevel),
    }
  })

export const DEMO_MATRIX_NAME = 'Ejemplo · IPEVAR demo'
