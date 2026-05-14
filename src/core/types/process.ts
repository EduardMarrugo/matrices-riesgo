export type Acceptability = 'acceptable' | 'tolerable' | 'critical'

export interface SharedControls {
  engineering: string
  administrative: string
  ppe: string
}

export interface SstEvaluation {
  hazardType: string
  hazardDescription: string
  effects: string
  probability: number
  consequence: number
  riskLevel: number
  acceptability: Acceptability
  isPriority: boolean
}

export interface MasoEvaluation {
  aspect: string
  impact: string
  probability: number
  consequence: number
  riskLevel: number
  acceptability: Acceptability
  isSignificant: boolean
}

export interface UnifiedActivity {
  id: string
  name: string
  description: string
  responsibleRole: string
  sst: SstEvaluation
  maso: MasoEvaluation
  controls: SharedControls
}

export interface ProcessEntity {
  id: string
  clientId: string
  name: string
  description: string
  owner: string
  createdAt: string
  updatedAt: string
  activities: UnifiedActivity[]
}

export interface Client {
  id: string
  name: string
  sector: string
  createdAt: string
}
