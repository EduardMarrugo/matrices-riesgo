import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Client,
  ProcessEntity,
  UnifiedActivity,
} from '@/core/types/process'
import { newId } from '@/core/utils/id'
import { nowIso } from '@/core/utils/date'
import { buildDemoProcess } from '@/core/utils/demoProcess'

interface ProcessState {
  clients: Client[]
  processes: ProcessEntity[]
  activeClientId: string | null
  activeProcessId: string | null
}

interface ProcessActions {
  createClient: (input: { name: string; sector: string }) => Client
  selectClient: (clientId: string | null) => void
  createProcess: (input: {
    clientId: string
    name: string
    description?: string
    owner?: string
  }) => ProcessEntity
  createDemoProcess: (clientId: string) => ProcessEntity
  selectProcess: (processId: string | null) => void
  updateProcessMeta: (
    processId: string,
    patch: Partial<Pick<ProcessEntity, 'name' | 'description' | 'owner'>>,
  ) => void
  updateActivities: (processId: string, activities: UnifiedActivity[]) => void
}

type ProcessStore = ProcessState & ProcessActions

const STORE_NAME = 'sgsst-process-store'

export const useProcessStore = create<ProcessStore>()(
  persist(
    (set) => ({
      clients: [],
      processes: [],
      activeClientId: null,
      activeProcessId: null,

      createClient: ({ name, sector }) => {
        const client: Client = {
          id: newId(),
          name,
          sector,
          createdAt: nowIso(),
        }
        const demo = buildDemoProcess(client.id)
        set((state) => ({
          clients: [...state.clients, client],
          processes: [...state.processes, demo],
          activeClientId: state.activeClientId ?? client.id,
        }))
        return client
      },

      selectClient: (clientId) => {
        set({ activeClientId: clientId, activeProcessId: null })
      },

      createProcess: ({ clientId, name, description = '', owner = '' }) => {
        const process: ProcessEntity = {
          id: newId(),
          clientId,
          name,
          description,
          owner,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          activities: [],
        }
        set((state) => ({
          processes: [...state.processes, process],
          activeProcessId: process.id,
        }))
        return process
      },

      createDemoProcess: (clientId) => {
        const process = buildDemoProcess(clientId)
        set((state) => ({
          processes: [...state.processes, process],
          activeProcessId: process.id,
        }))
        return process
      },

      selectProcess: (processId) => {
        set({ activeProcessId: processId })
      },

      updateProcessMeta: (processId, patch) => {
        set((state) => ({
          processes: state.processes.map((process) =>
            process.id === processId
              ? { ...process, ...patch, updatedAt: nowIso() }
              : process,
          ),
        }))
      },

      updateActivities: (processId, activities) => {
        set((state) => ({
          processes: state.processes.map((process) =>
            process.id === processId
              ? { ...process, activities, updatedAt: nowIso() }
              : process,
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
