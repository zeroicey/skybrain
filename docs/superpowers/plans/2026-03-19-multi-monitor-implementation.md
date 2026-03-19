# 多路监控页面实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现多路监控页面 (`/monitor/multi`)，支持同时监控多个无人机视频

**Architecture:** 创建通用 PageHeader 组件和多路监控页面，使用 Segmented Control 切换布局，视频网格动态渲染

**Tech Stack:** React + TypeScript + Tailwind CSS + shadcn/ui + Lucide Icons

---

## 文件结构

```
src/
├── components/
│   ├── page-header.tsx          # 新建: 通用页面头部组件
│   ├── monitor/
│   │   ├── layout-switcher.tsx  # 新建: 布局切换器
│   │   ├── video-grid.tsx       # 新建: 视频网格容器
│   │   ├── video-card.tsx       # 新建: 单个视频卡片
│   │   └── quick-add-dropdown.tsx # 新建: 快速添加下拉
│   └── ui/
│       └── [existing shadcn components]
├── pages/
│   └── monitor/
│       └── multi.tsx            # 新建: 多路监控页面
├── types/
│   └── drone.ts                 # 新建: 无人机类型定义
└── data/
    └── mock-drones.ts          # 新建: Mock 数据
```

---

## Chunk 1: 通用组件和类型定义

### Task 1: 创建类型定义

**Files:**
- Create: `src/types/drone.ts`

```typescript
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
```

- [ ] **Step 1: 创建 drone.ts 类型文件**

### Task 2: 创建 Mock 数据

**Files:**
- Create: `src/data/mock-drones.ts`

```typescript
import { Drone } from '@/types/drone'

export const mockDrones: Drone[] = [
  {
    id: '1',
    name: '无人机-01',
    status: 'online',
    battery: 85,
    altitude: 120,
    streamUrl: '/videos/sample1.mp4'
  },
  {
    id: '2',
    name: '无人机-02',
    status: 'online',
    battery: 72,
    altitude: 95,
    streamUrl: '/videos/sample2.mp4'
  },
  {
    id: '3',
    name: '无人机-03',
    status: 'warning',
    battery: 45,
    altitude: 80,
    streamUrl: '/videos/sample3.mp4'
  },
  {
    id: '4',
    name: '无人机-04',
    status: 'online',
    battery: 90,
    altitude: 110,
    streamUrl: '/videos/sample4.mp4'
  },
  {
    id: '5',
    name: '无人机-05',
    status: 'offline',
    battery: 0,
    altitude: 0,
    streamUrl: ''
  },
  {
    id: '6',
    name: '无人机-06',
    status: 'online',
    battery: 68,
    altitude: 105,
    streamUrl: '/videos/sample6.mp4'
  },
  {
    id: '7',
    name: '无人机-07',
    status: 'online',
    battery: 55,
    altitude: 88,
    streamUrl: '/videos/sample7.mp4'
  },
  {
    id: '8',
    name: '无人机-08',
    status: 'warning',
    battery: 30,
    altitude: 75,
    streamUrl: '/videos/sample8.mp4'
  },
  {
    id: '9',
    name: '无人机-09',
    status: 'online',
    battery: 92,
    altitude: 115,
    streamUrl: '/videos/sample9.mp4'
  }
]

export const getLayoutDrones = (layout: LayoutMode, drones: Drone[]): Drone[] => {
  const count = layout === '1x2' ? 2 : layout === '2x2' ? 4 : 9
  return drones.filter(d => d.status !== 'offline').slice(0, count)
}
```

- [ ] **Step 2: 创建 mock-drones.ts Mock 数据文件**

### Task 3: 创建 PageHeader 通用组件

**Files:**
- Create: `src/components/page-header.tsx`

```tsx
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
```

- [ ] **Step 3: 创建 PageHeader 组件**

---

## Chunk 2: 监控相关组件

### Task 4: 添加必要的 shadcn 组件

**需要添加的组件:**
```bash
cd /home/oicey/projects/skybrain/apps/skybrain-web
npx shadcn@latest add segmented -y
npx shadcn@latest add dropdown-menu -y
```

- [ ] **Step 4: 添加 Segmented 和 DropdownMenu 组件**

### Task 6: 创建 LayoutSwitcher 组件

### Task 7: 创建 VideoCard 组件

**Files:**
- Create: `src/components/monitor/video-card.tsx`

```tsx
import { Drone, Battery, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Maximize2, Video } from 'lucide-react'

interface VideoCardProps {
  drone: Drone
  onFullscreen?: (drone: Drone) => void
  className?: string
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  warning: 'bg-yellow-500',
}

export function VideoCard({ drone, onFullscreen, className }: VideoCardProps) {
  return (
    <div className={cn('relative rounded-lg overflow-hidden border bg-card group', className)}>
      {/* 视频区域 */}
      <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
        {drone.status !== 'offline' ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Video className="h-12 w-12 animate-pulse" />
            <span className="text-sm">视频流加载中...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Video className="h-12 w-12" />
            <span className="text-sm">离线</span>
          </div>
        )}

        {/* 全屏按钮 */}
        {drone.status !== 'offline' && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
            onClick={() => onFullscreen?.(drone)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}

        {/* 状态指示 */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full', statusColors[drone.status])} />
          <span className="text-xs text-white/80">{drone.name}</span>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="p-3 bg-muted/50 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            {drone.altitude}m
          </span>
          <span className="flex items-center gap-1">
            <Battery className={cn(
              'h-3.5 w-3.5',
              drone.battery > 60 ? 'text-green-500' :
              drone.battery > 30 ? 'text-yellow-500' : 'text-red-500'
            )} />
            {drone.battery}%
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 VideoCard 组件**

### Task 8: 创建 VideoGrid 组件

**Files:**
- Create: `src/components/monitor/video-grid.tsx`

```tsx
import { cn } from '@/lib/utils'
import { Drone, LayoutMode } from '@/types/drone'
import { VideoCard } from './video-card'

interface VideoGridProps {
  drones: Drone[]
  layout: LayoutMode
  onFullscreen?: (drone: Drone) => void
  className?: string
}

const gridClasses: Record<LayoutMode, string> = {
  '1x2': 'grid-cols-1 md:grid-cols-2',
  '2x2': 'grid-cols-1 sm:grid-cols-2',
  '3x3': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
}

export function VideoGrid({ drones, layout, onFullscreen, className }: VideoGridProps) {
  return (
    <div className={cn(
      'grid gap-4',
      gridClasses[layout],
      className
    )}>
      {drones.map((drone) => (
        <VideoCard
          key={drone.id}
          drone={drone}
          onFullscreen={onFullscreen}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 6: 创建 VideoGrid 组件**

### Task 9: 创建 QuickAddDropdown 组件

**Files:**
- Create: `src/components/monitor/quick-add-dropdown.tsx`

```tsx
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Drone } from '@/types/drone'

interface QuickAddDropdownProps {
  availableDrones: Drone[]
  onAdd: (drone: Drone) => void
}

export function QuickAddDropdown({ availableDrones, onAdd }: QuickAddDropdownProps) {
  const offlineDrones = availableDrones.filter(d => d.status === 'offline')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          快速添加
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {offlineDrones.length === 0 ? (
          <DropdownMenuItem disabled>暂无可用无人机</DropdownMenuItem>
        ) : (
          offlineDrones.map((drone) => (
            <DropdownMenuItem
              key={drone.id}
              onClick={() => onAdd(drone)}
            >
              {drone.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 7: 创建 QuickAddDropdown 组件**

**Note:** 需要确保 dropdown-menu 组件已安装

```bash
npx shadcn@latest add dropdown-menu
```

- [ ] **Step 9.1: 添加 DropdownMenu 组件 (如果需要)**

---

## Chunk 3: 页面实现和路由

### Task 10: 创建多路监控页面

**Files:**
- Create: `src/pages/monitor/multi-monitor-page.tsx`

```tsx
import { useState } from 'react'
import { Expand, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { LayoutSwitcher } from '@/components/monitor/layout-switcher'
import { VideoGrid } from '@/components/monitor/video-grid'
import { QuickAddDropdown } from '@/components/monitor/quick-add-dropdown'
import { LayoutMode, Drone } from '@/types/drone'
import { mockDrones, getLayoutDrones } from '@/data/mock-drones'

export function MultiMonitorPage() {
  const [layout, setLayout] = useState<LayoutMode>('2x2')
  const [drones, setDrones] = useState<Drone[]>(() => getLayoutDrones('2x2', mockDrones))
  const [activeDrones, setActiveDrones] = useState<Drone[]>(mockDrones)

  const handleLayoutChange = (newLayout: LayoutMode) => {
    setLayout(newLayout)
    setDrones(getLayoutDrones(newLayout, activeDrones))
  }

  const handleAddDrone = (drone: Drone) => {
    const updatedDrones = activeDrones.map(d =>
      d.id === drone.id ? { ...d, status: 'online' as const } : d
    )
    setActiveDrones(updatedDrones)
    setDrones(getLayoutDrones(layout, updatedDrones))
  }

  const handleFullscreen = (drone: Drone) => {
    console.log('进入全屏:', drone.name)
    // TODO: 实现全屏功能
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="多路监控"
        description="同时监控多个无人机视频"
        actions={
          <>
            <LayoutSwitcher value={layout} onChange={handleLayoutChange} />
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              添加无人机
            </Button>
            <Button variant="outline" size="icon">
              <Expand className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="flex-1">
        <VideoGrid
          drones={drones}
          layout={layout}
          onFullscreen={handleFullscreen}
        />
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          当前显示: {drones.length} 个无人机
        </span>
        <QuickAddDropdown availableDrones={activeDrones} onAdd={handleAddDrone} />
      </div>
    </div>
  )
}
```

- [ ] **Step 10: 创建多路监控页面**

### Task 11: 更新 App.tsx 路由

**Files:**
- Modify: `src/App.tsx:20-23`

```tsx
// 添加导入
import { MultiMonitorPage } from '@/pages/monitor/multi-monitor-page'

// 在 Routes 中添加路由
<Route path="/monitor/multi" element={<MultiMonitorPage />} />
```

- [ ] **Step 11: 添加路由**

---

## 验证步骤

所有组件创建完成后，运行以下命令验证：

```bash
# 1. 启动开发服务器
cd /home/oicey/projects/skybrain/apps/skybrain-web
bun run dev

# 2. 访问页面验证
# 浏览器打开 http://localhost:5173/monitor/multi
```

**预期结果:**
- [ ] 页面正常加载，显示标题"多路监控"
- [ ] Segmented Control 可以切换布局 (1x2 / 2x2 / 3x3)
- [ ] 视频网格根据布局显示对应数量的无人机卡片
- [ ] 每个卡片显示无人机名称、状态指示、电池、高度
- [ ] 底部显示快速添加下拉
- [ ] 添加无人机和全屏按钮可见

---

## 实现顺序

1. Task 1: 创建类型定义 (drone.ts)
2. Task 2: 创建 Mock 数据 (mock-drones.ts)
3. Task 3: 创建 PageHeader 组件
4. Task 4: 添加 Segmented 和 DropdownMenu 组件
5. Task 6: 创建 LayoutSwitcher 组件
6. Task 7: 创建 VideoCard 组件
7. Task 8: 创建 VideoGrid 组件
8. Task 9: 创建 QuickAddDropdown 组件
9. Task 10: 创建多路监控页面
10. Task 11: 添加路由
11. 验证页面