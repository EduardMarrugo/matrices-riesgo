import { create } from 'zustand'

export type ActiveView = 'matrices' | 'indicators'

interface UiStore {
  activeView: ActiveView
  sidebarOpen: boolean
  setActiveView: (view: ActiveView) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  activeView: 'matrices',
  sidebarOpen: false,
  setActiveView: (view) => set({ activeView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
