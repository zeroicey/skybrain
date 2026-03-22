export type DroneStatus = 'online' | 'offline' | 'warning'

export interface Drone {
  id: string
  name: string
  status: DroneStatus
  battery: number
  altitude: number
  streamUrl: string
}

export type VideoQuality = '流畅' | '高清' | '4K'

export interface VideoRecord {
  id: string
  droneId: string
  droneName: string
  startTime: string
  endTime: string
  duration: number // 秒
  fileSize: string
}

export type LayoutMode = '1x2' | '2x2' | '3x3'