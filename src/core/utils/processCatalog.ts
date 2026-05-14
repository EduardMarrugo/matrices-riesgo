export const HAZARD_TYPES = [
  'Físico',
  'Químico',
  'Biológico',
  'Ergonómico',
  'Psicosocial',
  'Mecánico',
  'Eléctrico',
  'Locativo',
  'Trabajo en alturas',
  'Espacios confinados',
  'Otros',
] as const

export const MASO_ASPECT_TYPES = [
  'Consumo de agua',
  'Consumo de energía',
  'Generación de residuos sólidos',
  'Generación de residuos peligrosos',
  'Vertimientos líquidos',
  'Emisiones atmosféricas',
  'Ruido ambiental',
  'Otros',
] as const

export type HazardType = (typeof HAZARD_TYPES)[number]
export type MasoAspectType = (typeof MASO_ASPECT_TYPES)[number]
