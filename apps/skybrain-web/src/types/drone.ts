export type DroneStatus = 'online' | 'offline' | 'warning'

export interface Drone {
  id: string
  name: string
  status: DroneStatus
  battery: number
  altitude: number
  streamUrl: string
}

export type LayoutMode = '1x2' | '2x2' | '3x3'