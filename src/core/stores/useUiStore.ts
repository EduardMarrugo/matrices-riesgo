import { create } from 'zustand'

export type ActiveView = 'matrices' | 'indicators'

interface UiStore {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
}

export const useUiStore = create<UiStore>((set) => ({
  activeView: 'matrices',
  setActiveView: (view) => set({ activeView: view }),
}))
