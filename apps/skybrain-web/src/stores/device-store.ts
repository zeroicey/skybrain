import { create } from 'zustand'
import type { DeviceDrone, Hangar, Battery, MaintenanceRecord } from '@/types/drone'

interface DeviceStore {
  // 无人机
  drones: DeviceDrone[]
  setDrones: (drones: DeviceDrone[]) => void
  addDrone: (drone: DeviceDrone) => void
  updateDrone: (id: string, data: Partial<DeviceDrone>) => void
  deleteDrone: (id: string) => void

  // 机库
  hangars: Hangar[]
  setHangars: (hangars: Hangar[]) => void
  addHangar: (hangar: Hangar) => void
  updateHangar: (id: string, data: Partial<Hangar>) => void

  // 电池
  batteries: Battery[]
  setBatteries: (batteries: Battery[]) => void

  // 维护记录
  maintenanceRecords: MaintenanceRecord[]
  setMaintenanceRecords: (records: MaintenanceRecord[]) => void
  addMaintenanceRecord: (record: MaintenanceRecord) => void
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  // 初始状态
  drones: [],
  hangars: [],
  batteries: [],
  maintenanceRecords: [],

  // 无人机操作
  setDrones: (drones) => set({ drones }),
  addDrone: (drone) => set((state) => ({ drones: [...state.drones, drone] })),
  updateDrone: (id, data) => set((state) => ({
    drones: state.drones.map((d) => d.id === id ? { ...d, ...data } : d)
  })),
  deleteDrone: (id) => set((state) => ({
    drones: state.drones.filter((d) => d.id !== id)
  })),

  // 机库操作
  setHangars: (hangars) => set({ hangars }),
  addHangar: (hangar) => set((state) => ({ hangars: [...state.hangars, hangar] })),
  updateHangar: (id, data) => set((state) => ({
    hangars: state.hangars.map((h) => h.id === id ? { ...h, ...data } : h)
  })),

  // 电池操作
  setBatteries: (batteries) => set({ batteries }),

  // 维护记录操作
  setMaintenanceRecords: (records) => set({ maintenanceRecords: records }),
  addMaintenanceRecord: (record) => set((state) => ({
    maintenanceRecords: [...state.maintenanceRecords, record]
  })),
}))