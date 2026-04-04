# 终端页面实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 SkyBrain 终端页面，一个数据密集型指挥中心仪表盘，展示无人机状态、任务概览、设备电池、告警中心、飞行统计和实时监控视频。

**Architecture:** 使用现有的 shadcn/ui 组件库，结合 mock 数据驱动展示。页面采用 4 列网格布局，数据密集展示。

**Tech Stack:** React + TypeScript + shadcn/ui + lucide-react + mock 数据

---

## 文件结构

```
apps/skybrain-web/src/
├── pages/modules/
│   └── dashboard/
│       └── dashboard-page.tsx    # 新建: 终端页面主组件
├── components/dashboard/
│   ├── drone-status-card.tsx     # 新建: 无人机状态卡片
│   ├── task-overview-card.tsx    # 新建: 任务概览卡片
│   ├── battery-status-card.tsx   # 新建: 设备电池卡片
│   ├── alert-list.tsx            # 新建: 告警列表
│   ├── flight-stats-card.tsx     # 新建: 飞行统计卡片
│   └── video-grid.tsx            # 新建: 实时视频Grid
└── router.ts                     # 修改: 添加路由
```

---

## Chunk 1: 路由配置

### Task 1: 添加 Dashboard 路由

**Files:**
- Modify: `apps/skybrain-web/src/router.ts:1-107`

- [ ] **Step 1: 添加 Dashboard 页面导入**

在文件顶部添加:
```typescript
const DashboardPage = lazy(() => import("@/pages/modules/dashboard/dashboard-page"));
```

- [ ] **Step 2: 添加 Dashboard 路由**

在 children 数组中添加（建议放在最前面，在 index: true 之后）:
```typescript
{ path: "dashboard", Component: DashboardPage },
```

- [ ] **Step 3: 更新 Sidebar 指向**

修改 `apps/skybrain-web/src/components/sidebar/app-sidebar.tsx` 中的仪表盘链接:
```typescript
{ title: "仪表盘", url: "/dashboard", icon: Home },
```

- [ ] **Step 4: Commit**

```bash
git add apps/skybrain-web/src/router.ts apps/skybrain-web/src/components/sidebar/app-sidebar.tsx
git commit -m "feat: add dashboard route and update sidebar link"
```

---

## Chunk 2: 状态卡片组件

### Task 2: 创建无人机状态卡片

**Files:**
- Create: `apps/skybrain-web/src/components/dashboard/drone-status-card.tsx`

- [ ] **Step 1: 创建 DroneStatusCard 组件**

```typescript
import { Drone, Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DroneStatusCardProps {
  drones: Drone[]
}

export function DroneStatusCard({ drones }: DroneStatusCardProps) {
  const onlineCount = drones.filter(d => d.status === 'online').length
  const warningCount = drones.filter(d => d.status === 'warning').length
  const offlineCount = drones.filter(d => d.status === 'offline').length

  const batteryHigh = drones.filter(d => d.battery > 80).length
  const batteryMedium = drones.filter(d => d.battery > 50 && d.battery <= 80).length
  const batteryLow = drones.filter(d => d.battery <= 50).length

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Drone className="h-4 w-4" />
          无人机状态
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{onlineCount}</div>
            <div className="text-xs text-zinc-400">在线</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
            <div className="text-xs text-zinc-400">警告</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{offlineCount}</div>
            <div className="text-xs text-zinc-400">离线</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-zinc-400">电池分布</div>
          <div className="flex gap-2 text-xs">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>&gt;80%</span>
                <span>{batteryHigh}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${(batteryHigh / drones.length) * 100}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>50-80%</span>
                <span>{batteryMedium}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${(batteryMedium / drones.length) * 100}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>&lt;50%</span>
                <span>{batteryLow}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${(batteryLow / drones.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/components/dashboard/drone-status-card.tsx
git commit -m "feat: add drone status card component"
```

### Task 3: 创建任务概览卡片

**Files:**
- Create: `apps/skybrain-web/src/components/dashboard/task-overview-card.tsx`

- [ ] **Step 1: 创建 TaskOverviewCard 组件**

```typescript
import { ListTodo, Play, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/types/task'

interface TaskOverviewCardProps {
  tasks: Task[]
}

export function TaskOverviewCard({ tasks }: TaskOverviewCardProps) {
  const today = new Date().toISOString().split('T')[0]

  const runningCount = tasks.filter(t => t.status === 'running').length
  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const completedToday = tasks.filter(t =>
    t.status === 'completed' && t.endTime?.startsWith(today)
  ).length
  const failedCount = tasks.filter(t =>
    t.status === 'failed' || t.status === 'cancelled'
  ).length

  const successRate = tasks.length > 0
    ? Math.round(((tasks.length - failedCount) / tasks.length) * 100)
    : 100

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          任务概览
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{runningCount}</div>
            <div className="text-xs text-zinc-400">进行中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-300">{pendingCount}</div>
            <div className="text-xs text-zinc-400">待执行</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{completedToday}</div>
            <div className="text-xs text-zinc-400">今日完成</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">失败/取消: {failedCount}</span>
          <span className={successRate >= 80 ? 'text-green-500' : 'text-yellow-500'}>
            成功率: {successRate}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/components/dashboard/task-overview-card.tsx
git commit -m "feat: add task overview card component"
```

### Task 4: 创建设备电池卡片

**Files:**
- Create: `apps/skybrain-web/src/components/dashboard/battery-status-card.tsx`

- [ ] **Step 1: 创建 BatteryStatusCard 组件**

```typescript
import { Battery, Zap, Power, Idle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Battery as BatteryType } from '@/types/drone'

interface BatteryStatusCardProps {
  batteries: BatteryType[]
}

export function BatteryStatusCard({ batteries }: BatteryStatusCardProps) {
  const chargingCount = batteries.filter(b => b.status === 'charging').length
  const dischargingCount = batteries.filter(b => b.status === 'discharging').length
  const idleCount = batteries.filter(b => b.status === 'idle').length
  const maintenanceCount = batteries.filter(b => b.status === 'maintenance').length

  const avgHealth = Math.round(
    batteries.reduce((sum, b) => sum + (b.health || 0), 0) / batteries.length
  )
  const needMaintenance = batteries.filter(b => (b.health || 0) < 60).length

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Battery className="h-4 w-4" />
          设备电池
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{chargingCount}</div>
            <div className="text-xs text-zinc-400">充电中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{dischargingCount}</div>
            <div className="text-xs text-zinc-400">使用中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-300">{idleCount}</div>
            <div className="text-xs text-zinc-400">空闲</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">平均健康度: {avgHealth}%</span>
          <span className={needMaintenance > 0 ? 'text-yellow-500' : 'text-green-500'}>
            需维护: {needMaintenance}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/components/dashboard/battery-status-card.tsx
git commit -m "feat: add battery status card component"
```

---

## Chunk 3: 告警和统计组件

### Task 5: 创建告警列表组件

**Files:**
- Create: `apps/skybrain-web/src/components/dashboard/alert-list.tsx`

- [ ] **Step 1: 创建 AlertList 组件**

```typescript
import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TaskLog } from '@/types/task'

interface AlertListProps {
  logs: TaskLog[]
}

function formatAlertTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function getAlertIcon(event: string) {
  switch (event) {
    case 'alert':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'completed':
      return <Info className="h-4 w-4 text-green-500" />
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

export function AlertList({ logs }: AlertListProps) {
  // 过滤出告警相关的日志
  const alertLogs = logs
    .filter(log => ['alert', 'failed', 'completed'].includes(log.event))
    .slice(0, 5)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            实时告警
          </span>
          <span className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">
            全部 →
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alertLogs.map(log => (
            <div key={log.id} className="flex items-start gap-3 text-xs">
              {getAlertIcon(log.event)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{log.droneName || log.taskName}</span>
                  <span className="text-zinc-500 whitespace-nowrap ml-2">
                    {formatAlertTime(log.timestamp)}
                  </span>
                </div>
                <div className="text-zinc-400 truncate">{log.message}</div>
              </div>
            </div>
          ))}
          {alertLogs.length === 0 && (
            <div className="text-center text-zinc-500 py-4 text-xs">
              暂无告警
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/components/dashboard/alert-list.tsx
git commit -m "feat: add alert list component"
```

### Task 6: 创建飞行统计卡片

**Files:**
- Create: `apps/skybrain-web/src/components/dashboard/flight-stats-card.tsx`

- [ ] **Step 1: 创建 FlightStatsCard 组件**

```typescript
import { BarChart3, Clock, Route, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FlightStatsCardProps {
  todayFlightMinutes: number
  todayTasks: number
  todayDistance: number
  successRate: number
}

export function FlightStatsCard({
  todayFlightMinutes,
  todayTasks,
  todayDistance,
  successRate
}: FlightStatsCardProps) {
  const hours = Math.floor(todayFlightMinutes / 60)
  const minutes = todayFlightMinutes % 60
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          今日飞行统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold">{timeDisplay}</div>
            <div className="text-xs text-zinc-400">飞行时长</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Route className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold">{todayTasks}</div>
            <div className="text-xs text-zinc-400">任务次数</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold">{todayDistance.toFixed(1)} km</div>
            <div className="text-xs text-zinc-400">飞行里程</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold text-green-500">{successRate}%</div>
            <div className="text-xs text-zinc-400">任务成功率</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/components/dashboard/flight-stats-card.tsx
git commit -m "feat: add flight stats card component"
```

---

## Chunk 4: 视频Grid和页面

### Task 7: 创建视频Grid组件

**Files:**
- Create: `apps/skybrain-web/src/components/dashboard/video-grid.tsx`

- [ ] **Step 1: 创建 VideoGrid 组件**

```typescript
import { Drone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Drone as DroneType } from '@/types/drone'

interface VideoGridProps {
  drones: DroneType[]
  onVideoClick?: (drone: DroneType) => void
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'offline':
      return 'bg-red-500'
    default:
      return 'bg-zinc-500'
  }
}

export function VideoGrid({ drones, onVideoClick }: VideoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {drones.map(drone => (
        <Card
          key={drone.id}
          className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors"
          onClick={() => onVideoClick?.(drone)}
        >
          <CardContent className="p-0">
            {/* 视频占位区域 */}
            <div className="aspect-video bg-zinc-800 flex items-center justify-center relative">
              {drone.streamUrl ? (
                <video
                  src={drone.streamUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Drone className="h-12 w-12 text-zinc-600" />
              )}
              {/* 状态指示点 */}
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${getStatusColor(drone.status)}`} />
            </div>
            {/* 底部信息 */}
            <div className="p-3 flex justify-between items-center">
              <div className="text-sm font-medium">{drone.name}</div>
              <div className="text-xs text-zinc-400">
                🔋 {drone.battery}%
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/components/dashboard/video-grid.tsx
git commit -m "feat: add video grid component"
```

### Task 8: 创建 Dashboard 主页面

**Files:**
- Create: `apps/skybrain-web/src/pages/modules/dashboard/dashboard-page.tsx`

- [ ] **Step 1: 创建 DashboardPage 组件**

```typescript
import { useEffect, useState } from 'react'
import { ScanEye, RefreshCw } from 'lucide-react'
import { DroneStatusCard } from '@/components/dashboard/drone-status-card'
import { TaskOverviewCard } from '@/components/dashboard/task-overview-card'
import { BatteryStatusCard } from '@/components/dashboard/battery-status-card'
import { AlertList } from '@/components/dashboard/alert-list'
import { FlightStatsCard } from '@/components/dashboard/flight-stats-card'
import { VideoGrid } from '@/components/dashboard/video-grid'

import { mockDrones } from '@/data/mock-drones'
import { mockTasks, mockTaskLogs } from '@/data/mock-tasks'
import { mockDeviceBatteries } from '@/data/mock-device-batteries'

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 计算统计数据
  const onlineDrones = mockDrones.filter(d => d.status === 'online').length
  const runningTasks = mockTasks.filter(t => t.status === 'running').length
  const completedToday = mockTasks.filter(t =>
    t.status === 'completed' && t.endTime?.startsWith(new Date().toISOString().split('T')[0])
  ).length
  const successRate = mockTasks.length > 0
    ? Math.round(((mockTasks.length - mockTasks.filter(t => t.status === 'failed' || t.status === 'cancelled').length) / mockTasks.length) * 100)
    : 100

  // 模拟飞行数据
  const todayFlightMinutes = 4 * 60 + 32 // 4h 32m
  const todayTasks = mockTasks.filter(t => t.status === 'completed' || t.status === 'running').length
  const todayDistance = 28.5

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScanEye className="h-8 w-8 text-sky-500" />
          <div>
            <h1 className="text-2xl font-bold">SkyBrain 终端</h1>
            <p className="text-sm text-zinc-400">智能无人机管理系统</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-zinc-400">
              {currentTime.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-lg font-mono">
              {currentTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <RefreshCw className="h-5 w-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 状态卡片行 */}
      <div className="grid grid-cols-4 gap-4">
        <DroneStatusCard drones={mockDrones} />
        <TaskOverviewCard tasks={mockTasks} />
        <BatteryStatusCard batteries={mockDeviceBatteries} />
        <AlertList logs={mockTaskLogs} />
      </div>

      {/* 飞行统计 */}
      <FlightStatsCard
        todayFlightMinutes={todayFlightMinutes}
        todayTasks={todayTasks}
        todayDistance={todayDistance}
        successRate={successRate}
      />

      {/* 实时监控视频Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          实时监控
          <span className="text-sm font-normal text-zinc-400">
            ({onlineDrones} 架在线)
          </span>
        </h2>
        <VideoGrid drones={mockDrones} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/pages/modules/dashboard/dashboard-page.tsx
git commit -m "feat: add dashboard page"
```

---

## 验收检查

- [ ] 路由已添加，访问 /dashboard 能正常显示
- [ ] 4个状态卡片正常显示数据
- [ ] 飞行统计卡片显示正确
- [ ] 视频Grid显示9个无人机视频卡片
- [ ] 告警列表显示最新5条
- [ ] 页面整体风格统一，响应式正常

---

## 完整 Commit

最后合并所有更改:

```bash
git add apps/skybrain-web/src/
git commit -m "feat: add dashboard page with drone status, task overview, battery status, alerts, flight stats, and video grid

- Add dashboard route
- Create drone status card component
- Create task overview card component
- Create battery status card component
- Create alert list component
- Create flight stats card component
- Create video grid component
- Create main dashboard page"
```