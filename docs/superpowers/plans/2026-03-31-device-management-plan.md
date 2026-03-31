# 设备管理模块实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现校园无人机智能巡检系统的设备管理模块，包括无人机列表、无人机详情（含3D模型）、机库管理、电池管理、维护记录等功能。

**Architecture:** 基于现有 React + TypeScript + shadcn/ui 技术栈，使用 Zustand 管理状态，遵循现有页面和组件模式。路由使用 React Router，与现有模块（monitor、task、scene）保持一致。

**Tech Stack:** React 18, TypeScript, shadcn/ui, Zustand, React Router, Lucide React

---

## 文件结构

根据设计文档，需要创建以下文件：

### 类型定义
- 修改: `apps/skybrain-web/src/types/drone.ts` - 扩展 Drone 类型，添加设备管理所需的字段

### Mock 数据 (新建)
- `apps/skybrain-web/src/data/mock-device-drones.ts`
- `apps/skybrain-web/src/data/mock-device-hangars.ts`
- `apps/skybrain-web/src/data/mock-device-batteries.ts`
- `apps/skybrain-web/src/data/mock-device-maintenance.ts`

### Store (新建)
- `apps/skybrain-web/src/stores/device-store.ts`

### 组件 (新建)
- `apps/skybrain-web/src/components/device/drone-card.tsx`
- `apps/skybrain-web/src/components/device/drone-detail.tsx`
- `apps/skybrain-web/src/components/device/drone-3d-viewer.tsx`
- `apps/skybrain-web/src/components/device/hangar-card.tsx`
- `apps/skybrain-web/src/components/device/battery-card.tsx`
- `apps/skybrain-web/src/components/device/battery-stats.tsx`
- `apps/skybrain-web/src/components/device/maintenance-table.tsx`
- `apps/skybrain-web/src/components/device/add-drone-dialog.tsx`
- `apps/skybrain-web/src/components/device/add-hangar-dialog.tsx`
- `apps/skybrain-web/src/components/device/add-battery-dialog.tsx`
- `apps/skybrain-web/src/components/device/add-maintenance-dialog.tsx`
- `apps/skybrain-web/src/components/device/hangar-environment.tsx`
- `apps/skybrain-web/src/components/device/drone-slot.tsx`

### 页面 (新建)
- `apps/skybrain-web/src/pages/modules/device/drones-page.tsx`
- `apps/skybrain-web/src/pages/modules/device/drone-detail-page.tsx`
- `apps/skybrain-web/src/pages/modules/device/hangars-page.tsx`
- `apps/skybrain-web/src/pages/modules/device/batteries-page.tsx`
- `apps/skybrain-web/src/pages/modules/device/maintenance-page.tsx`

### 路由配置 (修改)
- `apps/skybrain-web/src/router.ts` - 添加设备管理路由

---

## Chunk 1: 类型定义和 Mock 数据

### Task 1: 扩展 Drone 类型定义

**Files:**
- Modify: `apps/skybrain-web/src/types/drone.ts`

- [ ] **Step 1: 扩展类型定义**

```typescript
// apps/skybrain-web/src/types/drone.ts
// 在文件末尾添加以下类型

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
```

- [ ] **Step 2: 提交更改**

```bash
git add apps/skybrain-web/src/types/drone.ts
git commit -m "feat: add device management types to drone.ts"
```

---

### Task 2: 创建 Mock 数据文件

**Files:**
- Create: `apps/skybrain-web/src/data/mock-device-drones.ts`
- Create: `apps/skybrain-web/src/data/mock-device-hangars.ts`
- Create: `apps/skybrain-web/src/data/mock-device-batteries.ts`
- Create: `apps/skybrain-web/src/data/mock-device-maintenance.ts`

- [ ] **Step 1: 创建无人机 Mock 数据**

```typescript
// apps/skybrain-web/src/data/mock-device-drones.ts
import type { DeviceDrone } from '@/types/drone'

export const mockDeviceDrones: DeviceDrone[] = [
  {
    id: 'drone-001',
    name: '无人机-01',
    model: 'DJI Mavic 3 Pro',
    serialNumber: 'DJI20260314001',
    firmwareVersion: 'v1.2.3',
    status: 'online',
    battery: 85,
    totalFlightTime: 156,
    totalFlights: 520,
    lastMaintenance: '2026-03-01',
    location: '机库1',
    imageUrl: '/images/drones/drone-01.png',
    streamUrl: '/videos/sample1.mp4'
  },
  {
    id: 'drone-002',
    name: '无人机-02',
    model: 'DJI Air 3',
    serialNumber: 'DJI20260314002',
    firmwareVersion: 'v1.1.8',
    status: 'flying',
    battery: 72,
    totalFlightTime: 98,
    totalFlights: 320,
    lastMaintenance: '2026-02-28',
    location: '巡逻中',
    imageUrl: '/images/drones/drone-02.png',
    streamUrl: '/videos/sample2.mp4'
  },
  {
    id: 'drone-003',
    name: '无人机-03',
    model: 'DJI Mavic 3 Pro',
    serialNumber: 'DJI20260314003',
    firmwareVersion: 'v1.2.3',
    status: 'offline',
    battery: 0,
    totalFlightTime: 245,
    totalFlights: 780,
    lastMaintenance: '2026-01-15',
    location: '机库2',
    imageUrl: '/images/drones/drone-03.png'
  },
  {
    id: 'drone-004',
    name: '无人机-04',
    model: 'DJI Mini 4 Pro',
    serialNumber: 'DJI20260314004',
    firmwareVersion: 'v2.0.1',
    status: 'charging',
    battery: 95,
    totalFlightTime: 45,
    totalFlights: 150,
    lastMaintenance: '2026-03-10',
    location: '机库1',
    imageUrl: '/images/drones/drone-04.png'
  },
  {
    id: 'drone-005',
    name: '无人机-05',
    model: 'DJI Mavic 3 Pro',
    serialNumber: 'DJI20260314005',
    firmwareVersion: 'v1.2.3',
    status: 'maintenance',
    battery: 60,
    totalFlightTime: 312,
    totalFlights: 950,
    lastMaintenance: '2026-03-25',
    location: '维修车间',
    imageUrl: '/images/drones/drone-05.png'
  },
  {
    id: 'drone-006',
    name: '无人机-06',
    model: 'DJI Air 3',
    serialNumber: 'DJI20260314006',
    firmwareVersion: 'v1.1.8',
    status: 'online',
    battery: 88,
    totalFlightTime: 67,
    totalFlights: 210,
    lastMaintenance: '2026-03-05',
    location: '机库3',
    imageUrl: '/images/drones/drone-06.png'
  },
  {
    id: 'drone-007',
    name: '无人机-07',
    model: 'DJI Mavic 3 Pro',
    serialNumber: 'DJI20260314007',
    firmwareVersion: 'v1.2.3',
    status: 'online',
    battery: 76,
    totalFlightTime: 189,
    totalFlights: 620,
    lastMaintenance: '2026-02-20',
    location: '机库1',
    imageUrl: '/images/drones/drone-07.png'
  },
  {
    id: 'drone-008',
    name: '无人机-08',
    model: 'DJI Mini 4 Pro',
    serialNumber: 'DJI20260314008',
    firmwareVersion: 'v2.0.1',
    status: 'online',
    battery: 92,
    totalFlightTime: 23,
    totalFlights: 85,
    lastMaintenance: '2026-03-15',
    location: '机库2',
    imageUrl: '/images/drones/drone-08.png'
  }
]
```

- [ ] **Step 2: 创建机库 Mock 数据**

```typescript
// apps/skybrain-web/src/data/mock-device-hangars.ts
import type { Hangar } from '@/types/drone'

export const mockDeviceHangars: Hangar[] = [
  {
    id: 'hangar-001',
    name: '机库1',
    location: '教学楼A楼顶',
    droneSlots: [
      { id: 'slot-001', droneId: 'drone-001', droneName: '无人机-01', status: 'standby', battery: 85 },
      { id: 'slot-002', droneId: 'drone-004', droneName: '无人机-04', status: 'charging', battery: 95 },
      { id: 'slot-003', droneId: 'drone-007', droneName: '无人机-07', status: 'standby', battery: 76 },
      { id: 'slot-004', status: 'empty' }
    ],
    status: 'normal',
    temperature: 25,
    humidity: 60
  },
  {
    id: 'hangar-002',
    name: '机库2',
    location: '行政楼楼顶',
    droneSlots: [
      { id: 'slot-005', droneId: 'drone-003', droneName: '无人机-03', status: 'standby', battery: 0 },
      { id: 'slot-006', droneId: 'drone-008', droneName: '无人机-08', status: 'standby', battery: 92 },
      { id: 'slot-007', status: 'empty' },
      { id: 'slot-008', status: 'empty' }
    ],
    status: 'normal',
    temperature: 23,
    humidity: 55
  },
  {
    id: 'hangar-003',
    name: '机库3',
    location: '体育馆楼顶',
    droneSlots: [
      { id: 'slot-009', droneId: 'drone-006', droneName: '无人机-06', status: 'standby', battery: 88 },
      { id: 'slot-010', status: 'empty' }
    ],
    status: 'normal',
    temperature: 24,
    humidity: 58
  },
  {
    id: 'hangar-004',
    name: '维修车间',
    location: '后勤楼一层',
    droneSlots: [
      { id: 'slot-011', droneId: 'drone-005', droneName: '无人机-05', status: 'standby', battery: 60 }
    ],
    status: 'maintenance',
    temperature: 22,
    humidity: 50
  }
]
```

- [ ] **Step 3: 创建电池 Mock 数据**

```typescript
// apps/skybrain-web/src/data/mock-device-batteries.ts
import type { Battery } from '@/types/drone'

export const mockDeviceBatteries: Battery[] = [
  {
    id: 'battery-001',
    serialNumber: 'BT001',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
   电量: 85,
    cycleCount: 120,
    status: 'idle',
    health: 92,
    associatedDroneId: 'drone-001',
    associatedDroneName: '无人机-01'
  },
  {
    id: 'battery-002',
    serialNumber: 'BT002',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
   电量: 72,
    cycleCount: 180,
    status: 'discharging',
    health: 85,
    associatedDroneId: 'drone-002',
    associatedDroneName: '无人机-02'
  },
  {
    id: 'battery-003',
    serialNumber: 'BT003',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
   电量: 0,
    cycleCount: 450,
    status: 'idle',
    health: 45,
    associatedDroneId: 'drone-003',
    associatedDroneName: '无人机-03'
  },
  {
    id: 'battery-004',
    serialNumber: 'BT004',
    model: 'DJI Mini 4 Pro 电池',
    capacity: 3000,
   电量: 95,
    cycleCount: 45,
    status: 'charging',
    health: 98,
    associatedDroneId: 'drone-004',
    associatedDroneName: '无人机-04'
  },
  {
    id: 'battery-005',
    serialNumber: 'BT005',
    model: 'DJI Air 3 电池',
    capacity: 4000,
   电量: 60,
    cycleCount: 280,
    status: 'maintenance',
    health: 72
  },
  {
    id: 'battery-006',
    serialNumber: 'BT006',
    model: 'DJI Air 3 电池',
    capacity: 4000,
   电量: 88,
    cycleCount: 95,
    status: 'idle',
    health: 90,
    associatedDroneId: 'drone-006',
    associatedDroneName: '无人机-06'
  },
  {
    id: 'battery-007',
    serialNumber: 'BT007',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
   电量: 76,
    cycleCount: 210,
    status: 'idle',
    health: 88,
    associatedDroneId: 'drone-007',
    associatedDroneName: '无人机-07'
  },
  {
    id: 'battery-008',
    serialNumber: 'BT008',
    model: 'DJI Mini 4 Pro 电池',
    capacity: 3000,
   电量: 92,
    cycleCount: 25,
    status: 'idle',
    health: 99,
    associatedDroneId: 'drone-008',
    associatedDroneName: '无人机-08'
  },
  {
    id: 'battery-009',
    serialNumber: 'BT009',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
   电量: 100,
    cycleCount: 15,
    status: 'charging',
    health: 100
  },
  {
    id: 'battery-010',
    serialNumber: 'BT010',
    model: 'DJI Mavic 3 Pro 电池',
    capacity: 5000,
   电量: 100,
    cycleCount: 12,
    status: 'charging',
    health: 100
  },
  {
    id: 'battery-011',
    serialNumber: 'BT011',
    model: 'DJI Air 3 电池',
    capacity: 4000,
   电量: 100,
    cycleCount: 8,
    status: 'charging',
    health: 100
  },
  {
    id: 'battery-012',
    serialNumber: 'BT012',
    model: 'DJI Mini 4 Pro 电池',
    capacity: 3000,
   电量: 30,
    cycleCount: 320,
    status: 'maintenance',
    health: 55
  }
]
```

- [ ] **Step 4: 创建维护记录 Mock 数据**

```typescript
// apps/skybrain-web/src/data/mock-device-maintenance.ts
import type { MaintenanceRecord } from '@/types/drone'

export const mockDeviceMaintenance: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    date: '2026-03-28',
    deviceType: 'drone',
    deviceId: 'drone-005',
    deviceName: '无人机-05',
    type: 'repair',
    status: 'in_progress',
    executor: '张三',
    notes: '更换电机轴承'
  },
  {
    id: 'maint-002',
    date: '2026-03-25',
    deviceType: 'drone',
    deviceId: 'drone-001',
    deviceName: '无人机-01',
    type: 'routine',
    status: 'completed',
    executor: '李四',
    notes: '例行检查，更换螺旋桨'
  },
  {
    id: 'maint-003',
    date: '2026-03-20',
    deviceType: 'battery',
    deviceId: 'battery-005',
    deviceName: 'BT005',
    type: 'inspection',
    status: 'completed',
    executor: '王五',
    notes: '电池健康度检测'
  },
  {
    id: 'maint-004',
    date: '2026-03-15',
    deviceType: 'hangar',
    deviceId: 'hangar-001',
    deviceName: '机库1',
    type: 'inspection',
    status: 'completed',
    executor: '赵六',
    notes: '环境监控设备校准'
  },
  {
    id: 'maint-005',
    date: '2026-03-10',
    deviceType: 'drone',
    deviceId: 'drone-004',
    deviceName: '无人机-04',
    type: 'routine',
    status: 'completed',
    executor: '李四',
    notes: '例行检查，固件升级'
  },
  {
    id: 'maint-006',
    date: '2026-03-05',
    deviceType: 'drone',
    deviceId: 'drone-006',
    deviceName: '无人机-06',
    type: 'upgrade',
    status: 'completed',
    executor: '张三',
    notes: '升级到最新固件版本'
  },
  {
    id: 'maint-007',
    date: '2026-03-01',
    deviceType: 'battery',
    deviceId: 'battery-003',
    deviceName: 'BT003',
    type: 'repair',
    status: 'pending',
    executor: '王五',
    notes: '电池严重老化，需要更换'
  },
  {
    id: 'maint-008',
    date: '2026-02-28',
    deviceType: 'drone',
    deviceId: 'drone-002',
    deviceName: '无人机-02',
    type: 'routine',
    status: 'completed',
    executor: '李四',
    notes: '例行检查'
  },
  {
    id: 'maint-009',
    date: '2026-02-25',
    deviceType: 'camera',
    deviceId: 'camera-001',
    deviceName: '摄像头-01',
    type: 'inspection',
    status: 'completed',
    executor: '赵六',
    notes: '镜头清洁，云台校准'
  },
  {
    id: 'maint-010',
    date: '2026-02-20',
    deviceType: 'drone',
    deviceId: 'drone-007',
    deviceName: '无人机-07',
    type: 'routine',
    status: 'completed',
    executor: '张三',
    notes: '例行检查，传感器校准'
  }
]
```

- [ ] **Step 5: 提交更改**

```bash
git add apps/skybrain-web/src/data/mock-device-drones.ts apps/skybrain-web/src/data/mock-device-hangars.ts apps/skybrain-web/src/data/mock-device-batteries.ts apps/skybrain-web/src/data/mock-device-maintenance.ts
git commit -m "feat: add mock data for device management module"
```

---

## Chunk 2: Device Store 和基础组件

### Task 3: 创建 Device Store

**Files:**
- Create: `apps/skybrain-web/src/stores/device-store.ts`

- [ ] **Step 1: 编写测试**

```typescript
// apps/skybrain-web/src/stores/__tests__/device-store.test.ts
import { useDeviceStore } from '@/stores/device-store'
import type { DeviceDrone, Hangar, Battery, MaintenanceRecord } from '@/types/drone'

describe('deviceStore', () => {
  beforeEach(() => {
    // 重置 store 状态
    useDeviceStore.setState({
      drones: [],
      hangars: [],
      batteries: [],
      maintenanceRecords: []
    })
  })

  describe('drones', () => {
    const mockDrone: DeviceDrone = {
      id: 'test-1',
      name: '测试无人机',
      model: 'DJI Mavic 3 Pro',
      serialNumber: 'TEST001',
      firmwareVersion: 'v1.0.0',
      status: 'online',
      battery: 80,
      totalFlightTime: 100,
      totalFlights: 50,
      lastMaintenance: '2026-01-01',
      location: '机库1'
    }

    it('should set drones', () => {
      useDeviceStore.getState().setDrones([mockDrone])
      expect(useDeviceStore.getState().drones).toHaveLength(1)
    })

    it('should add drone', () => {
      useDeviceStore.getState().addDrone(mockDrone)
      expect(useDeviceStore.getState().drones).toContain(mockDrone)
    })

    it('should update drone', () => {
      useDeviceStore.getState().setDrones([mockDrone])
      useDeviceStore.getState().updateDrone('test-1', { battery: 50 })
      expect(useDeviceStore.getState().drones[0].battery).toBe(50)
    })

    it('should delete drone', () => {
      useDeviceStore.getState().setDrones([mockDrone])
      useDeviceStore.getState().deleteDrone('test-1')
      expect(useDeviceStore.getState().drones).toHaveLength(0)
    })
  })

  describe('hangars', () => {
    const mockHangar: Hangar = {
      id: 'hangar-1',
      name: '测试机库',
      location: '测试地点',
      droneSlots: [],
      status: 'normal',
      temperature: 25,
      humidity: 60
    }

    it('should set hangars', () => {
      useDeviceStore.getState().setHangars([mockHangar])
      expect(useDeviceStore.getState().hangars).toHaveLength(1)
    })

    it('should add hangar', () => {
      useDeviceStore.getState().addHangar(mockHangar)
      expect(useDeviceStore.getState().hangars).toContain(mockHangar)
    })
  })

  describe('batteries', () => {
    const mockBattery: Battery = {
      id: 'battery-1',
      serialNumber: 'BT001',
      model: '测试电池',
      capacity: 5000,
     电量: 100,
      cycleCount: 10,
      status: 'idle',
      health: 100
    }

    it('should set batteries', () => {
      useDeviceStore.getState().setBatteries([mockBattery])
      expect(useDeviceStore.getState().batteries).toHaveLength(1)
    })
  })

  describe('maintenanceRecords', () => {
    const mockRecord: MaintenanceRecord = {
      id: 'maint-1',
      date: '2026-03-31',
      deviceType: 'drone',
      deviceId: 'drone-1',
      deviceName: '无人机-01',
      type: 'routine',
      status: 'pending',
      executor: '张三'
    }

    it('should set maintenance records', () => {
      useDeviceStore.getState().setMaintenanceRecords([mockRecord])
      expect(useDeviceStore.getState().maintenanceRecords).toHaveLength(1)
    })

    it('should add maintenance record', () => {
      useDeviceStore.getState().addMaintenanceRecord(mockRecord)
      expect(useDeviceStore.getState().maintenanceRecords).toContain(mockRecord)
    })
  })
})
```

- [ ] **Step 2: 运行测试（预期失败）**

```bash
cd apps/skybrain-web && npm test -- --testPathPattern=device-store.test.ts --run
# 预期: FAIL - module not found
```

- [ ] **Step 3: 创建 Store 实现**

```typescript
// apps/skybrain-web/src/stores/device-store.ts
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
```

- [ ] **Step 4: 运行测试验证通过**

```bash
cd apps/skybrain-web && npm test -- --testPathPattern=device-store.test.ts --run
# 预期: PASS
```

- [ ] **Step 5: 提交更改**

```bash
git add apps/skybrain-web/src/stores/device-store.ts apps/skybrain-web/src/stores/__tests__/device-store.test.ts
git commit -m "feat: add device store with Zustand"
```

---

### Task 4: 创建基础设备组件

**Files:**
- Create: `apps/skybrain-web/src/components/device/drone-card.tsx`

- [ ] **Step 1: 编写测试**

```typescript
// apps/skybrain-web/src/components/device/__tests__/drone-card.test.tsx
import { render, screen } from '@testing-library/react'
import { DroneCard } from '../drone-card'
import type { DeviceDrone } from '@/types/drone'

const mockDrone: DeviceDrone = {
  id: 'drone-001',
  name: '无人机-01',
  model: 'DJI Mavic 3 Pro',
  serialNumber: 'DJI20260314001',
  firmwareVersion: 'v1.2.3',
  status: 'online',
  battery: 85,
  totalFlightTime: 156,
  totalFlights: 520,
  lastMaintenance: '2026-03-01',
  location: '机库1'
}

describe('DroneCard', () => {
  it('renders drone name', () => {
    render(<DroneCard drone={mockDrone} onDetailClick={() => {}} />)
    expect(screen.getByText('无人机-01')).toBeInTheDocument()
  })

  it('renders drone status', () => {
    render(<DroneCard drone={mockDrone} onDetailClick={() => {}} />)
    expect(screen.getByText('在线')).toBeInTheDocument()
  })

  it('renders battery percentage', () => {
    render(<DroneCard drone={mockDrone} onDetailClick={() => {}} />)
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('calls onDetailClick when detail button is clicked', () => {
    const mockOnClick = vi.fn()
    render(<DroneCard drone={mockDrone} onDetailClick={mockOnClick} />)
    screen.getByText('详情').click()
    expect(mockOnClick).toHaveBeenCalledWith('drone-001')
  })
})
```

- [ ] **Step 2: 运行测试（预期失败）**

```bash
cd apps/skybrain-web && npm test -- --testPathPattern=drone-card.test.tsx --run
# 预期: FAIL - module not found
```

- [ ] **Step 3: 创建 DroneCard 组件**

```tsx
// apps/skybrain-web/src/components/device/drone-card.tsx
import { Drone, Battery, Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DeviceDrone } from '@/types/drone'

interface DroneCardProps {
  drone: DeviceDrone
  onDetailClick: (id: string) => void
}

const statusMap = {
  online: { label: '在线', variant: 'default' as const },
  offline: { label: '离线', variant: 'secondary' as const },
  flying: { label: '飞行中', variant: 'default' as const },
  charging: { label: '充电中', variant: 'outline' as const },
  maintenance: { label: '维护中', variant: 'destructive' as const }
}

export function DroneCard({ drone, onDetailClick }: DroneCardProps) {
  const statusInfo = statusMap[drone.status]

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Drone className="h-5 w-5" />
            {drone.name}
          </CardTitle>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{drone.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Battery className="h-4 w-4" />
          <span>电池: {drone.battery}%</span>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${drone.battery}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>累计飞行: {drone.totalFlightTime}h</span>
        </div>
        <div className="text-xs text-muted-foreground">
          型号: {drone.model}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onDetailClick(drone.id)}
        >
          详情
        </Button>
      </CardFooter>
    </Card>
  )
}
```

- [ ] **Step 4: 运行测试验证通过**

```bash
cd apps/skybrain-web && npm test -- --testPathPattern=drone-card.test.tsx --run
# 预期: PASS
```

- [ ] **Step 5: 提交更改**

```bash
git add apps/skybrain-web/src/components/device/drone-card.tsx apps/skybrain-web/src/components/device/__tests__/drone-card.test.tsx
git commit -m "feat: add DroneCard component"
```

---

**参考此模式，继续创建其他组件：**

### Task 5: 创建其他设备组件（简化版）

由于篇幅限制，其他组件采用类似模式创建：

- **HangarCard** - 机库卡片组件
- **BatteryCard** - 电池卡片组件
- **BatteryStats** - 电池统计卡片
- **MaintenanceTable** - 维护记录表格
- **DroneSlot** - 机库无人机仓位
- **HangarEnvironment** - 机库环境监控

每个组件遵循同样的 TDD 流程：
1. 编写测试
2. 运行测试（预期失败）
3. 创建组件实现
4. 运行测试（通过）
5. 提交

---

## Chunk 3: 页面和路由

### Task 6: 创建设备管理页面

**Files:**
- Create: `apps/skybrain-web/src/pages/modules/device/drones-page.tsx`
- Create: `apps/skybrain-web/src/pages/modules/device/drone-detail-page.tsx`
- Create: `apps/skybrain-web/src/pages/modules/device/hangars-page.tsx`
- Create: `apps/skybrain-web/src/pages/modules/device/batteries-page.tsx`
- Create: `apps/skybrain-web/src/pages/modules/device/maintenance-page.tsx`

- [ ] **Step 1: 创建 DronesPage**

```tsx
// apps/skybrain-web/src/pages/modules/device/drones-page.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Search, Filter } from 'lucide-react'
import { useDeviceStore } from '@/stores/device-store'
import { mockDeviceDrones } from '@/data/mock-device-drones'
import { DroneCard } from '@/components/device/drone-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DronesPage() {
  const navigate = useNavigate()
  const { drones, setDrones } = useDeviceStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (drones.length === 0) {
      setDrones(mockDeviceDrones)
    }
  }, [drones.length, setDrones])

  const filteredDrones = drones.filter(drone => {
    const matchesSearch = drone.name.toLowerCase().includes(search.toLowerCase()) ||
      drone.model.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || drone.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const onlineCount = drones.filter(d => d.status === 'online').length

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">无人机列表</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          添加无人机
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="online">在线</SelectItem>
            <SelectItem value="offline">离线</SelectItem>
            <SelectItem value="flying">飞行中</SelectItem>
            <SelectItem value="charging">充电中</SelectItem>
            <SelectItem value="maintenance">维护中</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索无人机..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDrones.map(drone => (
          <DroneCard
            key={drone.id}
            drone={drone}
            onDetailClick={(id) => navigate(`/devices/drones/${id}`)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>在线: {onlineCount} / 总数: {drones.length}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 DroneDetailPage**

```tsx
// apps/skybrain-web/src/pages/modules/device/drone-detail-page.tsx
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Battery, Clock, MapPin, Settings } from 'lucide-react'
import { useDeviceStore } from '@/stores/device-store'
import { mockDeviceDrones } from '@/data/mock-device-drones'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DroneDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { drones, setDrones } = useDeviceStore()

  useEffect(() => {
    if (drones.length === 0) {
      setDrones(mockDeviceDrones)
    }
  }, [drones.length, setDrones])

  const drone = drones.find(d => d.id === id)

  if (!drone) {
    return (
      <div className="container mx-auto py-6">
        <p>无人机不存在</p>
        <Button onClick={() => navigate('/devices/drones')}>返回列表</Button>
      </div>
    )
  }

  const statusMap = {
    online: { label: '在线', variant: 'default' as const },
    offline: { label: '离线', variant: 'secondary' as const },
    flying: { label: '飞行中', variant: 'default' as const },
    charging: { label: '充电中', variant: 'outline' as const },
    maintenance: { label: '维护中', variant: 'destructive' as const }
  }

  const statusInfo = statusMap[drone.status]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/devices/drones')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {drone.name}
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </h1>
        <Button variant="outline" className="ml-auto">
          <Settings className="h-4 w-4 mr-2" />
          更多操作
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>3D 模型展示</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">3D 模型加载区域</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>无人机信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">型号</span>
                <span>{drone.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">序列号</span>
                <span>{drone.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">固件版本</span>
                <span>{drone.firmwareVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">累计飞行</span>
                <span>{drone.totalFlightTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">累计起降</span>
                <span>{drone.totalFlights}次</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次维护</span>
                <span>{drone.lastMaintenance}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>实时状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                <span>电池: {drone.battery}%</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${drone.battery}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>位置: {drone.location}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 提交更改**

```bash
git add apps/skybrain-web/src/pages/modules/device/drones-page.tsx apps/skybrain-web/src/pages/modules/device/drone-detail-page.tsx
git commit -m "feat: add drones page and drone detail page"
```

### Task 7: 添加路由配置

**Files:**
- Modify: `apps/skybrain-web/src/router.ts`

- [ ] **Step 1: 添加路由**

```typescript
// apps/skybrain-web/src/router.ts
// 在现有导入后添加
const DronesPage = lazy(() => import("@/pages/modules/device/drones-page"));
const DroneDetailPage = lazy(() => import("@/pages/modules/device/drone-detail-page"));
const HangarsPage = lazy(() => import("@/pages/modules/device/hangars-page"));
const BatteriesPage = lazy(() => import("@/pages/modules/device/batteries-page"));
const MaintenancePage = lazy(() => import("@/pages/modules/device/maintenance-page"));

// 在路由配置的 children 数组中添加
{
    path: "devices",
    children: [
        { path: "drones", Component: DronesPage },
        { path: "drones/:id", Component: DroneDetailPage },
        { path: "hangars", Component: HangarsPage },
        { path: "batteries", Component: BatteriesPage },
        { path: "maintenance", Component: MaintenancePage },
    ]
},
```

- [ ] **Step 2: 提交更改**

```bash
git add apps/skybrain-web/src/router.ts
git commit -m "feat: add device management routes"
```

---

## 实施顺序

1. **Chunk 1**: 类型定义 → Mock 数据
2. **Chunk 2**: Device Store → 基础组件（DroneCard 等）
3. **Chunk 3**: 页面 → 路由

每个 Chunk 完成后应进行功能验证，确保页面可访问且数据显示正确。

---

**Plan complete and saved to `docs/superpowers/plans/2026-03-31-device-management-plan.md`. Ready to execute?**