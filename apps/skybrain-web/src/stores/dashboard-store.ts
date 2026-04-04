import { create } from 'zustand'

interface DashboardState {
  droneVideoMap: Map<string, string>
  setDroneVideoMap: (map: Map<string, string>) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  droneVideoMap: new Map(),
  setDroneVideoMap: (map) => set({ droneVideoMap: map }),
}))