export type Acceptability = 'acceptable' | 'tolerable' | 'critical'

export interface RowControls {
  engineering: string
  administrative: string
  ppe: string
}

export interface MatrixRow {
  id: string
  activity: string
  hazard: string
  controls: RowControls
  probability: number
  consequence: number
  riskLevel: number
  acceptability: Acceptability
}

export interface Client {
  id: string
  name: string
  sector: string
  createdAt: string
}

export interface RiskMatrix {
  id: string
  clientId: string
  name: string
  createdAt: string
  updatedAt: string
  rows: MatrixRow[]
}
