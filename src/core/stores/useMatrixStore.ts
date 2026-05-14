import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Client, MatrixRow, RiskMatrix } from '@/core/types/matrix'
import { newId } from '@/core/utils/id'
import { nowIso } from '@/core/utils/date'

interface MatrixState {
  clients: Client[]
  matrices: RiskMatrix[]
  activeClientId: string | null
  activeMatrixId: string | null
}

interface MatrixActions {
  createClient: (input: { name: string; sector: string }) => Client
  selectClient: (clientId: string | null) => void
  createMatrix: (input: { clientId: string; name: string }) => RiskMatrix
  updateMatrixRows: (matrixId: string, rows: MatrixRow[]) => void
}

type MatrixStore = MatrixState & MatrixActions

const STORE_NAME = 'sgsst-matrix-store'

export const useMatrixStore = create<MatrixStore>()(
  persist(
    (set) => ({
      clients: [],
      matrices: [],
      activeClientId: null,
      activeMatrixId: null,

      createClient: ({ name, sector }) => {
        const client: Client = {
          id: newId(),
          name,
          sector,
          createdAt: nowIso(),
        }
        set((state) => ({
          clients: [...state.clients, client],
          activeClientId: state.activeClientId ?? client.id,
        }))
        return client
      },

      selectClient: (clientId) => {
        set({ activeClientId: clientId, activeMatrixId: null })
      },

      createMatrix: ({ clientId, name }) => {
        const matrix: RiskMatrix = {
          id: newId(),
          clientId,
          name,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          rows: [],
        }
        set((state) => ({
          matrices: [...state.matrices, matrix],
          activeMatrixId: matrix.id,
        }))
        return matrix
      },

      updateMatrixRows: (matrixId, rows) => {
        set((state) => ({
          matrices: state.matrices.map((matrix) =>
            matrix.id === matrixId
              ? { ...matrix, rows, updatedAt: nowIso() }
              : matrix,
          ),
        }))
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
