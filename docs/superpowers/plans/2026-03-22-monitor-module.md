# 实时监控模块实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现实时监控模块的三个页面：视频监控（单路实时）、监控回放、多路监控（已存在）

**Architecture:** 使用 shadcn/ui 组件 + Tailwind CSS，复用现有 mock-drones 数据，新增 mock-video-records 模拟录像数据

**Tech Stack:** React, shadcn/ui, Tailwind CSS, Zustand, Lucide React, Bun

---

## 文件结构

```
src/
├── components/monitor/
│   ├── drone-selector.tsx      (新增 - 无人机选择下拉)
│   ├── video-player.tsx        (新增 - 视频播放区域)
│   ├── video-controls.tsx      (新增 - 播放控制条)
│   ├── drone-info-panel.tsx    (新增 - 无人机信息面板)
│   ├── video-timeline.tsx      (新增 - 录像时间轴)
│   └── record-table.tsx        (新增 - 录像列表表格)
├── data/
│   └── mock-video-records.ts   (新增 - 录像mock数据)
├── types/
│   └── drone.ts                (扩展 - VideoRecord类型)
├── pages/modules/monitor/
│   ├── live-page.tsx           (新增 - 视频监控页)
│   └── playback-page.tsx       (新增 - 监控回放页)
└── router.ts                   (修改 - 添加路由)
```

---

## Chunk 1: 数据与类型定义

### Task 1.1: 扩展 Drone 类型

**Files:**
- Modify: `apps/skybrain-web/src/types/drone.ts`

- [ ] **Step 1: 添加 VideoRecord 类型和 VideoQuality 类型**

```typescript
// 在 drone.ts 文件末尾添加

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
```

- [ ] **Step 2: 验证修改**

Run: `cat apps/skybrain-web/src/types/drone.ts`
Expected: 包含 VideoRecord 和 VideoQuality 类型

---

### Task 1.2: 创建录像 Mock 数据

**Files:**
- Create: `apps/skybrain-web/src/data/mock-video-records.ts`

- [ ] **Step 1: 创建 mock-video-records.ts**

```typescript
import type { VideoRecord } from '@/types/drone'

export const mockVideoRecords: VideoRecord[] = [
  {
    id: '1',
    droneId: '1',
    droneName: '无人机-01',
    startTime: '2026-03-22 10:00:00',
    endTime: '2026-03-22 10:30:00',
    duration: 1800,
    fileSize: '256 MB'
  },
  {
    id: '2',
    droneId: '1',
    droneName: '无人机-01',
    startTime: '2026-03-22 09:00:00',
    endTime: '2026-03-22 09:30:00',
    duration: 1800,
    fileSize: '248 MB'
  },
  {
    id: '3',
    droneId: '2',
    droneName: '无人机-02',
    startTime: '2026-03-22 08:00:00',
    endTime: '2026-03-22 08:45:00',
    duration: 2700,
    fileSize: '378 MB'
  },
  {
    id: '4',
    droneId: '3',
    droneName: '无人机-03',
    startTime: '2026-03-21 14:00:00',
    endTime: '2026-03-21 14:30:00',
    duration: 1800,
    fileSize: '252 MB'
  },
  {
    id: '5',
    droneId: '4',
    droneName: '无人机-04',
    startTime: '2026-03-21 10:00:00',
    endTime: '2026-03-21 11:00:00',
    duration: 3600,
    fileSize: '512 MB'
  },
  {
    id: '6',
    droneId: '2',
    droneName: '无人机-02',
    startTime: '2026-03-20 16:00:00',
    endTime: '2026-03-20 16:30:00',
    duration: 1800,
    fileSize: '245 MB'
  },
  {
    id: '7',
    droneId: '1',
    droneName: '无人机-01',
    startTime: '2026-03-20 09:00:00',
    endTime: '2026-03-20 10:00:00',
    duration: 3600,
    fileSize: '498 MB'
  },
  {
    id: '8',
    droneId: '5',
    droneName: '无人机-05',
    startTime: '2026-03-19 11:00:00',
    endTime: '2026-03-19 11:30:00',
    duration: 1800,
    fileSize: '251 MB'
  }
]
```

- [ ] **Step 2: 验证文件创建**

Run: `ls apps/skybrain-web/src/data/mock-video-records.ts`
Expected: 文件存在

---

## Chunk 2: 共享组件

### Task 2.1: 创建 DroneSelector 组件

**Files:**
- Create: `apps/skybrain-web/src/components/monitor/drone-selector.tsx`

- [ ] **Step 1: 创建 drone-selector.tsx**

```typescript
import { useState } from 'react'
import { Video } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockDrones } from '@/data/mock-drones'
import type { Drone, DroneStatus } from '@/types/drone'

interface DroneSelectorProps {
  value?: string
  onChange: (droneId: string) => void
  placeholder?: string
  excludeOffline?: boolean
}

const statusColors: Record<DroneStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  warning: 'bg-yellow-500',
}

export function DroneSelector({
  value,
  onChange,
  placeholder = '选择无人机',
  excludeOffline = true
}: DroneSelectorProps) {
  const drones = excludeOffline
    ? mockDrones.filter(d => d.status !== 'offline')
    : mockDrones

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <Video className="mr-2 h-4 w-4" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {drones.map((drone) => (
          <SelectItem key={drone.id} value={drone.id}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[drone.status]}`} />
              <span>{drone.name}</span>
              <span className="text-muted-foreground text-xs">🔋{drone.battery}%</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 2: 验证组件创建**

Run: `ls apps/skybrain-web/src/components/monitor/drone-selector.tsx`
Expected: 文件存在

---

### Task 2.2: 创建 VideoPlayer 组件

**Files:**
- Create: `apps/skybrain-web/src/components/monitor/video-player.tsx`

- [ ] **Step 1: 创建 video-player.tsx**

```typescript
import { Loader2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  isLoading?: boolean
  isOffline?: boolean
  className?: string
}

export function VideoPlayer({
  isLoading = false,
  isOffline = false,
  className
}: VideoPlayerProps) {
  return (
    <div className={cn(
      'relative bg-black rounded-lg overflow-hidden flex items-center justify-center',
      'aspect-video',
      className
    )}>
      {isLoading && (
        <div className="flex flex-col items-center gap-3 text-white/70">
          <Loader2 className="h-16 w-16 animate-spin" />
          <span className="text-lg">视频流加载中...</span>
          <span className="text-sm text-white/50">正在连接无人机图传信号</span>
        </div>
      )}

      {isOffline && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">离线</span>
          <span className="text-sm">无人机已离线，无法接收视频信号</span>
        </div>
      )}

      {!isLoading && !isOffline && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">等待信号</span>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 验证组件创建**

Run: `ls apps/skybrain-web/src/components/monitor/video-player.tsx`
Expected: 文件存在

---

### Task 2.3: 创建 VideoControls 组件

**Files:**
- Create: `apps/skybrain-web/src/components/monitor/video-controls.tsx`

- [ ] **Step 1: 创建 video-controls.tsx**

```typescript
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Camera,
  Circle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface VideoControlsProps {
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  volume?: number
  isMuted?: boolean
  onPlayPause?: () => void
  onSkipBack?: () => void
  onSkipForward?: () => void
  onVolumeChange?: (volume: number) => void
  onMuteToggle?: () => void
  onFullscreen?: () => void
  onSnapshot?: () => void
  onRecord?: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function VideoControls({
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 80,
  isMuted = false,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
  onSnapshot,
  onRecord,
}: VideoControlsProps) {
  const [localVolume, setLocalVolume] = useState(volume)
  const [isRecording, setIsRecording] = useState(false)

  const handleVolumeChange = (value: number[]) => {
    setLocalVolume(value[0])
    onVolumeChange?.(value[0])
  }

  const handleRecordToggle = () => {
    setIsRecording(!isRecording)
    onRecord?.()
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
      {/* 进度条 */}
      <Slider
        defaultValue={[currentTime]}
        max={duration || 100}
        step={1}
        className="cursor-pointer"
      />

      {/* 控制按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* 跳过后退 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkipBack}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* 播放/暂停 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          {/* 跳过前进 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkipForward}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* 时间显示 */}
          <span className="text-sm text-muted-foreground ml-2 min-w-[100px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 截图 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSnapshot}
            className="h-8 w-8"
            title="截图"
          >
            <Camera className="h-4 w-4" />
          </Button>

          {/* 录像 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRecordToggle}
            className={cn(
              'h-8 w-8',
              isRecording && 'text-red-500'
            )}
            title={isRecording ? '停止录像' : '开始录像'}
          >
            <Circle className={cn('h-4 w-4', isRecording && 'fill-current')} />
          </Button>

          {/* 音量 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMuteToggle}
            className="h-8 w-8"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Slider
            value={[isMuted ? 0 : localVolume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-20 cursor-pointer"
          />

          {/* 全屏 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onFullscreen}
            className="h-8 w-8"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 检查是否需要 Slider 组件**

Run: `ls apps/skybrain-web/src/components/ui/slider.tsx`
Expected: 文件存在（如不存在需要添加 shadcn slider）

- [ ] **Step 3: 验证组件创建**

Run: `ls apps/skybrain-web/src/components/monitor/video-controls.tsx`
Expected: 文件存在

---

### Task 2.4: 创建 DroneInfoPanel 组件

**Files:**
- Create: `apps/skybrain-web/src/components/monitor/drone-info-panel.tsx`

- [ ] **Step 1: 创建 drone-info-panel.tsx**

```typescript
import { MapPin, Gauge, Battery } from 'lucide-react'
import type { Drone } from '@/types/drone'
import { cn } from '@/lib/utils'

interface DroneInfoPanelProps {
  drone?: Drone
  speed?: number
  location?: string
}

const batteryColors = {
  high: 'text-green-500',
  medium: 'text-yellow-500',
  low: 'text-red-500',
}

function getBatteryColor(battery: number): 'high' | 'medium' | 'low' {
  if (battery > 60) return 'high'
  if (battery > 30) return 'medium'
  return 'low'
}

export function DroneInfoPanel({
  drone,
  speed = 0,
  location = '未知',
}: DroneInfoPanelProps) {
  if (!drone) {
    return (
      <div className="flex items-center gap-6 p-3 bg-muted/30 rounded-lg text-muted-foreground">
        <span className="text-sm">未选择无人机</span>
      </div>
    )
  }

  const batteryLevel = getBatteryColor(drone.battery)

  return (
    <div className="flex items-center gap-6 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{drone.altitude}m</span>
        <span className="text-xs text-muted-foreground">高度</span>
      </div>

      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{speed}m/s</span>
        <span className="text-xs text-muted-foreground">速度</span>
      </div>

      <div className="flex items-center gap-2">
        <Battery className={cn('h-4 w-4', batteryColors[batteryLevel])} />
        <span className={cn('text-sm font-medium', batteryColors[batteryLevel])}>
          {drone.battery}%
        </span>
        <span className="text-xs text-muted-foreground">电池</span>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{location}</span>
        <span className="text-xs text-muted-foreground">位置</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 验证组件创建**

Run: `ls apps/skybrain-web/src/components/monitor/drone-info-panel.tsx`
Expected: 文件存在

---

### Task 2.5: 创建 VideoTimeline 组件

**Files:**
- Create: `apps/skybrain-web/src/components/monitor/video-timeline.tsx`

- [ ] **Step 1: 创建 video-timeline.tsx**

```typescript
import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import type { VideoRecord } from '@/types/drone'

interface VideoTimelineProps {
  records?: VideoRecord[]
  currentTime?: number
  onSeek?: (time: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function VideoTimeline({
  records = [],
  currentTime = 0,
  onSeek,
}: VideoTimelineProps) {
  // 模拟：总时长为当前录像的时长
  const totalDuration = records.length > 0 ? records[0].duration : 3600

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>录像时间轴</span>
        <span>{formatTime(totalDuration)}</span>
      </div>
      <Slider
        value={[currentTime]}
        onValueChange={(value) => onSeek?.(value[0])}
        max={totalDuration}
        step={1}
        className="cursor-pointer"
      />
    </div>
  )
}
```

- [ ] **Step 2: 验证组件创建**

Run: `ls apps/skybrain-web/src/components/monitor/video-timeline.tsx`
Expected: 文件存在

---

### Task 2.6: 创建 RecordTable 组件

**Files:**
- Create: `apps/skybrain-web/src/components/monitor/record-table.tsx`

- [ ] **Step 1: 创建 record-table.tsx**

```typescript
import { Play, Download } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { VideoRecord } from '@/types/drone'

interface RecordTableProps {
  records: VideoRecord[]
  onPlay?: (record: VideoRecord) => void
  onDownload?: (record: VideoRecord) => void
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}小时${mins}分钟`
  }
  if (mins > 0) {
    return `${mins}分钟${secs}秒`
  }
  return `${secs}秒`
}

export function RecordTable({ records, onPlay, onDownload }: RecordTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>无人机</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
            <TableHead>时长</TableHead>
            <TableHead>文件大小</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.droneName}</TableCell>
              <TableCell>{record.startTime}</TableCell>
              <TableCell>{record.endTime}</TableCell>
              <TableCell>{formatDuration(record.duration)}</TableCell>
              <TableCell>{record.fileSize}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPlay?.(record)}
                    title="播放"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDownload?.(record)}
                    title="下载"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                暂无录像记录
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

- [ ] **Step 2: 验证组件创建**

Run: `ls apps/skybrain-web/src/components/monitor/record-table.tsx`
Expected: 文件存在

---

## Chunk 3: 视频监控页面 (Live)

### Task 3.1: 创建 LivePage

**Files:**
- Create: `apps/skybrain-web/src/pages/modules/monitor/live-page.tsx`

- [ ] **Step 1: 创建 live-page.tsx**

```typescript
import { useState } from 'react'
import { Maximize2, Monitor } from 'lucide-react'
import { DroneSelector } from '@/components/monitor/drone-selector'
import { VideoPlayer } from '@/components/monitor/video-player'
import { VideoControls } from '@/components/monitor/video-controls'
import { DroneInfoPanel } from '@/components/monitor/drone-info-panel'
import { mockDrones } from '@/data/mock-drones'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Drone, VideoQuality } from '@/types/drone'

const qualities: VideoQuality[] = ['流畅', '高清', '4K']

export default function LivePage() {
  const [selectedDroneId, setSelectedDroneId] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [quality, setQuality] = useState<string>('流畅')

  const selectedDrone = mockDrones.find(d => d.id === selectedDroneId)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const handleSkipForward = () => {
    setCurrentTime(currentTime + 10)
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    setIsMuted(value === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    console.log('进入全屏')
  }

  const handleSnapshot = () => {
    console.log('截图')
  }

  const handleRecord = () => {
    console.log('录像')
  }

  // 模拟播放时间递增
  useState(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(t => t + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  })

  return (
    <div className="flex flex-col h-full">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <DroneSelector
            value={selectedDroneId}
            onChange={setSelectedDroneId}
            placeholder="选择无人机"
          />
          {selectedDrone && (
            <Badge variant="outline" className="gap-1">
              <span className={`w-2 h-2 rounded-full ${
                selectedDrone.status === 'online' ? 'bg-green-500' :
                selectedDrone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              {selectedDrone.status === 'online' ? '在线' :
               selectedDrone.status === 'warning' ? '警告' : '离线'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* 画质切换 */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            {qualities.map((q) => (
              <Button
                key={q}
                variant={quality === q ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setQuality(q)}
                className="text-xs h-6 px-2"
              >
                {q}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={handleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 视频区域 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            isLoading={!!selectedDrone && selectedDrone.status !== 'offline'}
            isOffline={selectedDrone?.status === 'offline'}
          />

          <div className="mt-4">
            <VideoControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={3600}
              volume={volume}
              isMuted={isMuted}
              onPlayPause={handlePlayPause}
              onSkipBack={handleSkipBack}
              onSkipForward={handleSkipForward}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={handleMuteToggle}
              onFullscreen={handleFullscreen}
              onSnapshot={handleSnapshot}
              onRecord={handleRecord}
            />
          </div>

          <div className="mt-4">
            <DroneInfoPanel
              drone={selectedDrone}
              speed={12}
              location="教学区A"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 验证组件创建**

Run: `ls apps/skybrain-web/src/pages/modules/monitor/live-page.tsx`
Expected: 文件存在

---

## Chunk 4: 监控回放页面 (Playback)

### Task 4.1: 创建 PlaybackPage

**Files:**
- Create: `apps/skybrain-web/src/pages/modules/monitor/playback-page.tsx`

- [ ] **Step 1: 创建 playback-page.tsx**

```typescript
import { useState, useMemo } from 'react'
import { Search, Download, FileOutput } from 'lucide-react'
import { DroneSelector } from '@/components/monitor/drone-selector'
import { VideoPlayer } from '@/components/monitor/video-player'
import { VideoTimeline } from '@/components/monitor/video-timeline'
import { RecordTable } from '@/components/monitor/record-table'
import { mockVideoRecords } from '@/data/mock-video-records'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { VideoRecord } from '@/types/drone'

export default function PlaybackPage() {
  const [selectedDroneId, setSelectedDroneId] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentRecord, setCurrentRecord] = useState<VideoRecord | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 筛选录像
  const filteredRecords = useMemo(() => {
    return mockVideoRecords.filter(record => {
      // 无人机筛选
      if (selectedDroneId !== 'all' && record.droneId !== selectedDroneId) {
        return false
      }
      // 日期筛选
      if (selectedDate && !record.startTime.startsWith(selectedDate)) {
        return false
      }
      // 搜索筛选
      if (searchQuery && !record.droneName.includes(searchQuery)) {
        return false
      }
      return true
    })
  }, [selectedDroneId, selectedDate, searchQuery])

  // 分页
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, currentPage])

  const totalPages = Math.ceil(filteredRecords.length / pageSize)

  const handlePlay = (record: VideoRecord) => {
    setCurrentRecord(record)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleDownload = (record: VideoRecord) => {
    console.log('下载录像:', record.id)
  }

  const handleExport = () => {
    console.log('批量导出')
  }

  const handleSeek = (time: number) => {
    setCurrentTime(time)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 筛选栏 */}
      <div className="flex items-center gap-4 p-4 border-b">
        <DroneSelector
          value={selectedDroneId === 'all' ? '' : selectedDroneId}
          onChange={(id) => setSelectedDroneId(id || 'all')}
          placeholder="全部无人机"
          excludeOffline={false}
        />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-[150px]"
        />
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索录像..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 播放器区域 */}
          {currentRecord ? (
            <div className="space-y-4">
              <VideoPlayer isLoading={isPlaying} />
              <VideoTimeline
                records={[currentRecord]}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
              <div className="text-sm text-muted-foreground">
                正在播放: {currentRecord.droneName} - {currentRecord.startTime}
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">选择录像进行播放</p>
            </div>
          )}

          {/* 录像列表 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">录像列表</h3>
              <Button variant="outline" onClick={handleExport}>
                <FileOutput className="h-4 w-4 mr-2" />
                批量导出
              </Button>
            </div>
            <RecordTable
              records={paginatedRecords}
              onPlay={handlePlay}
              onDownload={handleDownload}
            />

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 验证组件创建**

Run: `ls apps/skybrain-web/src/pages/modules/monitor/playback-page.tsx`
Expected: 文件存在

---

## Chunk 5: 路由配置

### Task 5.1: 更新 Router

**Files:**
- Modify: `apps/skybrain-web/src/router.ts`

- [ ] **Step 1: 添加页面导入**

在文件顶部添加:

```typescript
const MonitorLivePage = lazy(() => import("@/pages/modules/monitor/live-page"))
const MonitorPlaybackPage = lazy(() => import("@/pages/modules/monitor/playback-page"))
```

- [ ] **Step 2: 更新路由配置**

将 monitor 路由 children 更新为:

```typescript
{
  path: "monitor",
  children: [
    { path: "live", Component: MonitorLivePage },
    { path: "playback", Component: MonitorPlaybackPage },
    { path: "multi", Component: MultiMonitorPage }
  ]
},
```

- [ ] **Step 3: 验证路由**

Run: `cat apps/skybrain-web/src/router.ts | grep -A 10 "path: \"monitor\""`
Expected: 包含 live, playback, multi 三个子路由

---

## 验收检查

完成所有任务后，运行以下检查：

- [ ] `/monitor/live` 页面可访问
- [ ] `/monitor/playback` 页面可访问
- [ ] 侧边栏链接正确指向 live 和 playback
- [ ] DroneSelector 组件可以正常选择无人机
- [ ] VideoPlayer 显示模拟加载状态
- [ ] VideoControls 播放控制按钮可点击
- [ ] DroneInfoPanel 显示无人机信息
- [ ] RecordTable 显示录像列表
- [ ] 分页功能正常
- [ ] 筛选功能正常（无人机、日期、搜索）

---

## 提交

```bash
cd apps/skybrain-web
git add src/components/monitor/ src/data/mock-video-records.ts src/types/drone.ts src/pages/modules/monitor/live-page.tsx src/pages/modules/monitor/playback-page.tsx src/router.ts
git commit -m "feat: add monitor live and playback pages

- Add drone-selector, video-player, video-controls components
- Add drone-info-panel, video-timeline, record-table components
- Create mock-video-records data
- Implement live monitor page with full controls
- Implement playback page with filtering and pagination
- Update router with new routes"

git push
```