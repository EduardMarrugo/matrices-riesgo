import type { ProcessEntity, UnifiedActivity } from '@/core/types/process'
import { newId } from './id'
import { nowIso } from './date'
import { computeRiskLevel, getAcceptability } from './risk'

interface ActivityTemplate {
  name: string
  description: string
  responsibleRole: string
  sst: {
    hazardType: string
    hazardDescription: string
    effects: string
    probability: number
    consequence: number
    isPriority: boolean
  }
  maso: {
    aspect: string
    impact: string
    probability: number
    consequence: number
    isSignificant: boolean
  }
  controls: { engineering: string; administrative: string; ppe: string }
}

const ACTIVITY_TEMPLATES: readonly ActivityTemplate[] = [
  {
    name: 'Trabajo administrativo en oficina',
    description: 'Labores de gestión documental y atención en puesto de trabajo.',
    responsibleRole: 'Auxiliar administrativo',
    sst: {
      hazardType: 'Ergonómico',
      hazardDescription: 'Postura prolongada sentado',
      effects: 'Lumbalgia, fatiga visual',
      probability: 6,
      consequence: 10,
      isPriority: false,
    },
    maso: {
      aspect: 'Consumo de energía',
      impact: 'Agotamiento de recursos no renovables',
      probability: 6,
      consequence: 10,
      isSignificant: false,
    },
    controls: {
      engineering: 'Sillas ergonómicas, soporte de monitor, iluminación LED',
      administrative: 'Pausas activas cada 2 horas, capacitación postural',
      ppe: 'No requiere',
    },
  },
  {
    name: 'Manipulación manual de cargas',
    description: 'Movimiento de cajas y materiales en bodega.',
    responsibleRole: 'Auxiliar de bodega',
    sst: {
      hazardType: 'Ergonómico',
      hazardDescription: 'Sobreesfuerzo, manipulación de cargas',
      effects: 'Lumbalgia, hernia discal',
      probability: 10,
      consequence: 25,
      isPriority: true,
    },
    maso: {
      aspect: 'Generación de residuos sólidos',
      impact: 'Contaminación por embalajes',
      probability: 10,
      consequence: 10,
      isSignificant: false,
    },
    controls: {
      engineering: 'Carretillas, transpaletas, ayudas mecánicas',
      administrative: 'Capacitación en manejo seguro, rotación de personal',
      ppe: 'Faja lumbar, guantes anti-corte',
    },
  },
  {
    name: 'Manejo de productos químicos',
    description: 'Mezcla y aplicación de sustancias químicas en planta.',
    responsibleRole: 'Operario químico',
    sst: {
      hazardType: 'Químico',
      hazardDescription: 'Exposición a vapores y salpicaduras',
      effects: 'Quemaduras químicas, intoxicación respiratoria',
      probability: 6,
      consequence: 60,
      isPriority: true,
    },
    maso: {
      aspect: 'Vertimientos líquidos',
      impact: 'Contaminación de fuentes hídricas',
      probability: 6,
      consequence: 60,
      isSignificant: true,
    },
    controls: {
      engineering: 'Ventilación local, contención de derrames, duchas',
      administrative: 'SDS, capacitación, permisos de trabajo',
      ppe: 'Respirador con filtro químico, guantes nitrilo, gafas',
    },
  },
  {
    name: 'Trabajo en alturas (>1.5 m)',
    description: 'Mantenimiento y montaje de estructuras elevadas.',
    responsibleRole: 'Técnico de alturas',
    sst: {
      hazardType: 'Trabajo en alturas',
      hazardDescription: 'Caída a distinto nivel',
      effects: 'Politraumatismos, muerte',
      probability: 10,
      consequence: 100,
      isPriority: true,
    },
    maso: {
      aspect: 'Generación de residuos peligrosos',
      impact: 'Contaminación por chatarra y aceites',
      probability: 6,
      consequence: 25,
      isSignificant: false,
    },
    controls: {
      engineering: 'Líneas de vida, barandas, plataformas certificadas',
      administrative: 'Permiso de trabajo, supervisión, certificación vigente',
      ppe: 'Arnés de cuerpo entero, casco con barbuquejo, eslingas',
    },
  },
]

const buildActivity = (template: ActivityTemplate): UnifiedActivity => {
  const sstLevel = computeRiskLevel(template.sst.probability, template.sst.consequence)
  const masoLevel = computeRiskLevel(
    template.maso.probability,
    template.maso.consequence,
  )
  return {
    id: newId(),
    name: template.name,
    description: template.description,
    responsibleRole: template.responsibleRole,
    controls: template.controls,
    sst: {
      hazardType: template.sst.hazardType,
      hazardDescription: template.sst.hazardDescription,
      effects: template.sst.effects,
      probability: template.sst.probability,
      consequence: template.sst.consequence,
      riskLevel: sstLevel,
      acceptability: getAcceptability(sstLevel),
      isPriority: template.sst.isPriority,
    },
    maso: {
      aspect: template.maso.aspect,
      impact: template.maso.impact,
      probability: template.maso.probability,
      consequence: template.maso.consequence,
      riskLevel: masoLevel,
      acceptability: getAcceptability(masoLevel),
      isSignificant: template.maso.isSignificant,
    },
  }
}

export const buildDemoActivities = (): UnifiedActivity[] =>
  ACTIVITY_TEMPLATES.map(buildActivity)

export const DEMO_PROCESS_NAME = 'Ejemplo · Proceso operativo demo'

export const buildDemoProcess = (clientId: string): ProcessEntity => ({
  id: newId(),
  clientId,
  name: DEMO_PROCESS_NAME,
  description:
    'Proceso de ejemplo con 4 actividades cubriendo distintos niveles de riesgo SST y aspectos ambientales MASO.',
  owner: 'Líder de operaciones',
  createdAt: nowIso(),
  updatedAt: nowIso(),
  activities: buildDemoActivities(),
})
