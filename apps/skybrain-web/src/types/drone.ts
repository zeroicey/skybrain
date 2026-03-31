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

// 设备管理 - 无人机状态
export type DeviceDroneStatus = 'online' | 'offline' | 'flying' | 'charging' | 'maintenance'

// 设备管理 - 无人机
export interface DeviceDrone {
  id: string
  name: string
  model: string              // 型号：DJI Mavic 3 Pro
  serialNumber: string        // 序列号
  firmwareVersion: string     // 固件版本
  status: DeviceDroneStatus
  battery: number             // 电池电量 0-100
  totalFlightTime: number     // 累计飞行时长（小时）
  totalFlights: number        // 累计起降次数
  lastMaintenance: string    // 上次维护时间
  location: string           // 当前位置/机库
  imageUrl?: string          // 无人机图片
  streamUrl?: string          // 视频流URL
}

// 机库仓位状态
export type DroneSlotStatus = 'empty' | 'charging' | 'standby'

// 机库仓位
export interface DroneSlot {
  id: string
  droneId?: string           // 无人机ID（如果正在充电）
  droneName?: string         // 无人机名称
  status: DroneSlotStatus
  battery?: number           // 电池电量
}

// 机库状态
export type HangarStatus = 'normal' | 'error' | 'maintenance'

// 机库
export interface Hangar {
  id: string
  name: string
  location: string           // 位置描述
  droneSlots: DroneSlot[]    // 无人机仓位
  status: HangarStatus
  temperature: number        // 温度（摄氏度）
  humidity: number           // 湿度（百分比）
}

// 电池状态
export type BatteryStatus = 'charging' | 'discharging' | 'idle' | 'maintenance'

// 电池
export interface Battery {
  id: string
  serialNumber: string
  model: string
  capacity: number           // 容量 mAh
 电量: number               // 当前电量 0-100
  cycleCount: number         // 循环次数
  status: BatteryStatus
  health: number             // 健康度 0-100
  associatedDroneId?: string // 所属无人机ID
  associatedDroneName?: string // 所属无人机名称
}

// 维护记录设备类型
export type MaintenanceDeviceType = 'drone' | 'hangar' | 'battery' | 'camera'

// 维护类型
export type MaintenanceType = 'routine' | 'repair' | 'inspection' | 'upgrade'

// 维护记录状态
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed'

// 维护记录
export interface MaintenanceRecord {
  id: string
  date: string
  deviceType: MaintenanceDeviceType
  deviceId: string
  deviceName: string
  type: MaintenanceType
  status: MaintenanceStatus
  executor: string          // 执行人
  notes?: string             // 备注
}