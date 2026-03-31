# 设备管理模块设计文档

> 日期：2026-03-31

## 1. 项目概述

实现校园无人机智能巡检系统的设备管理模块，包括无人机列表、无人机详情（含3D模型）、机库管理、电池管理、维护记录等功能。

## 2. 整体架构

```
apps/skybrain-web/
├── src/
│   ├── components/device/           # 设备管理组件
│   │   ├── drone-card.tsx           # 无人机卡片
│   │   ├── drone-detail.tsx        # 无人机详情面板
│   │   ├── drone-3d-viewer.tsx     # 3D模型查看器
│   │   ├── hangar-card.tsx         # 机库卡片
│   │   ├── battery-card.tsx        # 电池卡片
│   │   ├── battery-stats.tsx       # 电池统计卡片
│   │   ├── maintenance-table.tsx   # 维护记录表格
│   │   ├── add-drone-dialog.tsx    # 添加无人机对话框
│   │   ├── add-hangar-dialog.tsx   # 添加机库对话框
│   │   ├── add-battery-dialog.tsx  # 添加电池对话框
│   │   ├── add-maintenance-dialog.tsx  # 添加维护记录对话框
│   │   ├── hangar-environment.tsx  # 机库环境监控
│   │   └── drone-slot.tsx          # 机库无人机仓位
│   ├── pages/modules/device/       # 设备管理页面
│   │   ├── drones-page.tsx         # 无人机列表页
│   │   ├── drone-detail-page.tsx  # 无人机详情页
│   │   ├── hangars-page.tsx        # 机库管理页
│   │   ├── batteries-page.tsx      # 电池管理页
│   │   └── maintenance-page.tsx    # 维护记录页
│   ├── data/
│   │   ├── mock-device-drones.ts   # 设备管理-无人机数据
│   │   ├── mock-device-hangars.ts  # 设备管理-机库数据
│   │   ├── mock-device-batteries.ts # 设备管理-电池数据
│   │   └── mock-device-maintenance.ts # 设备管理-维护记录数据
│   ├── stores/
│   │   └── device-store.ts          # 设备管理 Store
│   └── types/
│       └── device.ts                # 设备类型定义
```

## 3. 路由配置

| 路由 | 组件 | 描述 |
|------|------|------|
| `/devices` | - | 重定向到 `/devices/drones` |
| `/devices/drones` | DronesPage | 无人机列表 |
| `/devices/drones/:id` | DroneDetailPage | 无人机详情（含3D模型） |
| `/devices/hangars` | HangarsPage | 机库管理 |
| `/devices/batteries` | BatteriesPage | 电池管理 |
| `/devices/maintenance` | MaintenancePage | 维护记录 |

## 4. 数据结构设计

### 4.1 无人机 (Drone)

```typescript
interface DeviceDrone {
  id: string
  name: string
  model: string              // 型号：DJI Mavic 3 Pro
  serialNumber: string        // 序列号
  firmwareVersion: string     // 固件版本
  status: 'online' | 'offline' | 'flying' | 'charging' | 'maintenance'
  battery: number             // 电池电量 0-100
  totalFlightTime: number     // 累计飞行时长（小时）
  totalFlights: number        // 累计起降次数
  lastMaintenance: string    // 上次维护时间
  location: string           // 当前位置/机库
  imageUrl?: string          // 无人机图片
  streamUrl?: string          // 视频流URL
}
```

### 4.2 机库 (Hangar)

```typescript
interface Hangar {
  id: string
  name: string
  location: string           // 位置描述
  droneSlots: DroneSlot[]    // 无人机仓位
  status: 'normal' | 'error' | 'maintenance'
  temperature: number        // 温度（摄氏度）
  humidity: number           // 湿度（百分比）
}

interface DroneSlot {
  id: string
  droneId?: string           // 无人机ID（如果正在充电）
  droneName?: string         // 无人机名称
  status: 'empty' | 'charging' | 'standby'
  battery?: number           // 电池电量
}
```

### 4.3 电池 (Battery)

```typescript
interface Battery {
  id: string
  serialNumber: string
  model: string
  capacity: number           // 容量 mAh
 电量: number               // 当前电量 0-100
  cycleCount: number         // 循环次数
  status: 'charging' | 'discharging' | 'idle' | 'maintenance'
  health: number             // 健康度 0-100
  associatedDroneId?: string // 所属无人机ID
  associatedDroneName?: string // 所属无人机名称
}
```

### 4.4 维护记录 (Maintenance)

```typescript
interface MaintenanceRecord {
  id: string
  date: string
  deviceType: 'drone' | 'hangar' | 'battery' | 'camera'
  deviceId: string
  deviceName: string
  type: 'routine' | 'repair' | 'inspection' | 'upgrade'
  status: 'pending' | 'in_progress' | 'completed'
  executor: string          // 执行人
  notes?: string             // 备注
}
```

## 5. 页面设计方案

### 5.1 无人机列表页 (`/devices/drones`)

```
┌─────────────────────────────────────────────────────────────────┐
│  标题: 无人机列表                              [添加无人机]按钮 │
├─────────────────────────────────────────────────────────────────┤
│  筛选: [状态▼] [型号▼] [位置▼]                    [搜索框]     │
├─────────────────────────────────────────────────────────────────┤
│  无人机网格 (Grid, 每行4个)                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 🛸 无人机1│ │ 🛸 无人机2│ │ 🛸 无人机3│ │ 🛸 无人机4│           │
│  │ 状态:在线 │ │ 状态:飞行 │ │ 状态:离线 │ │ 状态:充电 │           │
│  │ 电池:85%  │ │ 电池:72%  │ │ 电池:0%   │ │ 电池:95%  │           │
│  │ 今日:2h   │ │ 今日:1h   │ │ 今日:0h   │ │ 今日:0h   │           │
│  │ [详情]   │ │ [详情]    │ │ [详情]   │ │ [详情]   │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────────┤
│  底部: 统计 (在线: 5 / 总数: 8) + 分页器                         │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 无人机详情页 (`/devices/drones/:id`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← 返回  |  无人机名称  |  状态标签              [更多操作▼]    │
├────────────────────────────┬────────────────────────────────────┤
│                            │    无人机信息                      │
│    3D模型展示区域          │  型号: DJI Mavic 3 Pro            │
│    (使用现有Model组件)     │  序列号: DJI20260314001           │
│                            │  固件版本: v1.2.3                 │
│                            │  累计飞行: 156h                   │
│                            │  累计起降: 520次                  │
│                            │  上次维护: 2026-03-01             │
│                            ├────────────────────────────────────┤
│                            │    实时状态                        │
│                            │  电池: 85% [█████████░]           │
│                            │  状态: 待机                       │
│                            │  位置: 机库1                      │
│                            │  信号: 强                         │
│                            └────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│  飞行记录                                                       │
│  时间 | 任务名 | 起飞 | 降落 | 时长 | 状态                     │
│  ───────────────────────────────────────────────────────────   │
│  ...                                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 机库管理页 (`/devices/hangars`)

```
┌─────────────────────────────────────────────────────────────────┐
│  标题: 机库管理                                  [添加机库]按钮 │
├─────────────────────────────────────────────────────────────────┤
│  机库列表                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🏠 机库1 (教学楼A)                                        │  │
│  │    位置: 教学楼A楼顶 | 状态: 正常                         │  │
│  │    温度: 25°C | 湿度: 60%                                 │  │
│  │    ┌──────────────┐ ┌──────────────┐                    │  │
│  │    │ 仓位1:无人机1 │ │ 仓位2:无人机2 │                    │  │
│  │    │ 充电中 | 95%  │ │ 待机 | 85%   │                    │  │
│  │    └──────────────┘ └──────────────┘                    │  │
│  │    [开门] [关舱门]                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 电池管理页 (`/devices/batteries`)

```
┌─────────────────────────────────────────────────────────────────┐
│  标题: 电池管理                                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│  │ 总电池   │ │ 充电中   │ │ 空闲    │ │ 需要维护 │             │
│  │  16块   │ │   4块   │ │   8块   │ │   2块   │             │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
├─────────────────────────────────────────────────────────────────┤
│  筛选: [状态▼] [型号▼]                         [搜索框]       │
├─────────────────────────────────────────────────────────────────┤
│  电池表格                                                       │
│  编号 | 型号 | 电量 | 循环次数 | 状态 | 所属无人机 | 操作    │
│  ───────────────────────────────────────────────────────────   │
│  BT001 | DJI... | ████ | 120 | 空闲 | 无人机-01 | [详情]      │
│  ...                                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 维护记录页 (`/devices/maintenance`)

```
┌─────────────────────────────────────────────────────────────────┐
│  标题: 维护记录                              [添加记录] [导出] │
├─────────────────────────────────────────────────────────────────┤
│  筛选: [设备类型▼] [维护类型▼] [时间范围]                     │
├─────────────────────────────────────────────────────────────────┤
│  维护记录表格                                                   │
│  日期 | 设备 | 维护类型 | 执行人 | 状态 | 备注 | 操作         │
│  ───────────────────────────────────────────────────────────   │
│  2026-...| 无人机1 | 例行维护 | 张三 | 完成 | 更换电池 | ...  │
│  ...                                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 6. 组件设计

### 6.1 通用组件

- `DroneCard` - 无人机卡片（展示名称、状态、电池、飞行时长）
- `DroneDetail` - 无人机详情面板（展示详细信息）
- `Drone3DViewer` - 3D模型查看器（封装现有的 Model 组件）
- `HangarCard` - 机库卡片（展示位置、环境、仓位）
- `HangarEnvironment` - 机库环境监控（温度、湿度）
- `DroneSlot` - 无人机仓位（展示无人机、充电状态）
- `BatteryCard` - 电池卡片
- `BatteryStats` - 电池统计卡片（4个统计指标）
- `MaintenanceTable` - 维护记录表格

### 6.2 对话框组件

- `AddDroneDialog` - 添加无人机（表单：名称、型号、序列号、所属机库）
- `AddHangarDialog` - 添加机库（表单：名称、位置）
- `AddBatteryDialog` - 添加电池（表单：编号、型号、容量）
- `AddMaintenanceDialog` - 添加维护记录（表单：设备、维护类型、执行人、备注）

## 7. Store 设计

使用 Zustand 管理设备状态：

```typescript
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
```

## 8. 样式规范

- 使用现有 shadcn/ui 组件
- 保持与现有页面一致的布局和样式
- 响应式设计适配不同屏幕尺寸
- 颜色和间距遵循现有设计系统

## 9. 数据关联

- 无人机可关联机库（位置）
- 电池可关联无人机（所属）
- 维护记录关联具体设备（无人机、机库、电池、摄像头）
- 点击电池的"所属无人机"可跳转到无人机详情页