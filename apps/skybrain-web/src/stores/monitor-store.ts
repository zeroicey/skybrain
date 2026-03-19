import { create } from 'zustand'
import type { Drone } from '@/types/drone'

interface MonitorStore {
  droneCount: number
  activeDrones: Drone[]
  setDroneState: (drones: Drone[], activeDrones: Drone[]) => void
}

export const useMonitorStore = create<MonitorStore>((set) => ({
  droneCount: 0,
  activeDrones: [],
  setDroneState: (drones, activeDrones) => set({
    droneCount: drones.length,
    activeDrones
  }),
}))