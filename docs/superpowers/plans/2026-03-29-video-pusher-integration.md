# 视频推流与前端集成实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现后端 API 供前端获取视频 channel 列表，前端接入 HLS 视频流播放

**Architecture:** 后端 Go 新增 REST 接口返回 JSON 格式 channel 列表；前端添加 hls.js 播放 HLS 流，通过 hook 获取视频列表并随机分配

**Tech Stack:** Go (gin), React, hls.js, Zustand

---

## 文件结构

```
apps/videopusher/
├── main.go                    # 新增 /api/channels 接口

apps/skybrain-web/
├── package.json               # 添加 hls.js 依赖
├── src/
│   ├── hooks/
│   │   └── useVideoChannels.ts    # 新增：获取视频 channel 列表
│   ├── components/
│   │   └── monitor/
│   │       └── video-player.tsx  # 改造：支持 HLS 播放
│   ├── pages/modules/
│   │   └── scene/
│   │       ├── canteen-page.tsx      # 改造：使用 HLS 视频
│   │       ├── shops-page.tsx        # 改造
│   │       ├── dormitory-page.tsx    # 改造
│   │       ├── building-page.tsx     # 改造
│   │       └── gate-page.tsx         # 改造
│   └── pages/modules/monitor/
│       └── multi-monitor-page.tsx    # 改造：随机分配视频
```

---

## Chunk 1: 后端 API 实现

### Task 1: 新增 /api/channels 接口

**Files:**
- Modify: `apps/videopusher/main.go`

- [ ] **Step 1: 添加 ChannelResponse 结构体**

在 `main.go` 中添加：
```go
type ChannelInfo struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Scene string `json:"scene"`
}

type ChannelResponse struct {
    Channels []ChannelInfo `json:"channels"`
}
```

- [ ] **Step 2: 修改 Channel 结构体添加 Scene 字段**

修改现有的 `Channel` 结构体：
```go
type Channel struct {
    Name  string // channel 名称，如 "1", "canteen/1"
    Path  string // 视频文件完整路径
    Scene string // 场景标识: "root", "canteen", "street" 等
}
```

- [ ] **Step 3: 修改 scanVideosDir 函数返回 Scene 信息**

更新 `scanVideosDir()` 函数，在返回的 Channel 中添加 Scene 字段：
- 根目录视频 → Scene = "root"
- 各场景子目录 → Scene = 目录名 (canteen, street, dormitory, building, gate)

- [ ] **Step 4: 添加 /api/channels 路由处理函数**

在 main 函数中添加：
```go
// 注册 /api/channels 接口
http.HandleFunc("/api/channels", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")

    channels := scanVideosDir()
    var channelInfos []ChannelInfo
    for _, ch := range channels {
        channelInfos = append(channelInfos, ChannelInfo{
            ID:    ch.Name,
            Name:  filepath.Base(ch.Path),
            Scene: ch.Scene,
        })
    }

    jsonBytes, _ := json.Marshal(ChannelResponse{Channels: channelInfos})
    w.Write(jsonBytes)
})
```

- [ ] **Step 5: 测试 API**

Run: 启动后端后访问 `http://localhost:8889/api/channels`
Expected: 返回 JSON 格式的 channel 列表

- [ ] **Step 6: Commit**

```bash
git add apps/videopusher/main.go
git commit -m "feat: 新增 /api/channels 接口返回视频 channel 列表"
```

---

## Chunk 2: 前端依赖与 VideoPlayer 改造

### Task 2: 添加 hls.js 依赖

**Files:**
- Modify: `apps/skybrain-web/package.json`

- [ ] **Step 1: 添加 hls.js 依赖**

Run: `cd apps/skybrain-web && bun add hls.js`

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/package.json apps/skybrain-web/bun.lock
git commit -m "chore: 添加 hls.js 依赖"
```

---

### Task 3: 创建 useVideoChannels Hook

**Files:**
- Create: `apps/skybrain-web/src/hooks/useVideoChannels.ts`

- [ ] **Step 1: 创建 useVideoChannels hook**

```typescript
import { useState, useEffect } from 'react'

export interface ChannelInfo {
  id: string
  name: string
  scene: string
}

const API_BASE_URL = 'http://localhost:8889'

export function useVideoChannels() {
  const [channels, setChannels] = useState<ChannelInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChannels() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/channels`)
        const data = await response.json()
        setChannels(data.channels || [])
      } catch (err) {
        setError('获取视频列表失败')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChannels()
  }, [])

  // 获取指定场景的 channel
  const getChannelsByScene = (scene: string) => {
    return channels.filter(ch => ch.scene === scene)
  }

  // 随机选择一个 channel
  const getRandomChannel = (scene?: string) => {
    const filtered = scene ? getChannelsByScene(scene) : channels
    if (filtered.length === 0) return null
    const randomIndex = Math.floor(Math.random() * filtered.length)
    return filtered[randomIndex]
  }

  // 随机打乱并返回前 n 个
  const getRandomChannels = (count: number) => {
    const shuffled = [...channels].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  return {
    channels,
    loading,
    error,
    getChannelsByScene,
    getRandomChannel,
    getRandomChannels,
  }
}

// 获取视频流 URL
export function getStreamUrl(channelId: string): string {
  return `${API_BASE_URL}/channel/${channelId}/index.m3u8`
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/hooks/useVideoChannels.ts
git commit -m "feat: 添加 useVideoChannels hook 获取视频 channel 列表"
```

---

### Task 4: 改造 VideoPlayer 支持 HLS

**Files:**
- Modify: `apps/skybrain-web/src/components/monitor/video-player.tsx`

- [ ] **Step 1: 改造 VideoPlayer 支持 HLS**

```typescript
import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Loader2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  streamUrl?: string | null  // HLS 流地址
  isLoading?: boolean
  isOffline?: boolean
  className?: string
}

export function VideoPlayer({
  streamUrl,
  isLoading = false,
  isOffline = false,
  className
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!streamUrl || !videoRef.current) {
      return
    }

    setHasError(false)
    const video = videoRef.current

    // 如果是 HLS 流
    if (streamUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.loadSource(streamUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.error('HLS 加载错误:', data)
            setHasError(true)
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
              default:
                hls.destroy()
                break
            }
          }
        })

        return () => {
          hls.destroy()
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari 原生支持 HLS
        video.src = streamUrl
      }
    } else {
      // 普通视频文件
      video.src = streamUrl
    }
  }, [streamUrl])

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

      {hasError && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">信号中断</span>
          <span className="text-sm">视频流加载失败</span>
        </div>
      )}

      {!isLoading && !isOffline && !hasError && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      )}

      {!streamUrl && !isLoading && !isOffline && !hasError && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">等待信号</span>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/skybrain-web/src/components/monitor/video-player.tsx
git commit -m "feat: VideoPlayer 组件支持 HLS 流播放"
```

---

## Chunk 3: 场景页面改造

### Task 5: 改造 5 个场景页面

**Files:**
- Modify: `apps/skybrain-web/src/pages/modules/scene/canteen-page.tsx`
- Modify: `apps/skybrain-web/src/pages/modules/scene/shops-page.tsx`
- Modify: `apps/skybrain-web/src/pages/modules/scene/dormitory-page.tsx`
- Modify: `apps/skybrain-web/src/pages/modules/scene/building-page.tsx`
- Modify: `apps/skybrain-web/src/pages/modules/scene/gate-page.tsx`

- [ ] **Step 1: 改造 canteen-page.tsx**

在 canteen-page.tsx 中：

1. 导入 hook 和组件：
```typescript
import { useVideoChannels, getStreamUrl } from '@/hooks/useVideoChannels'
import { VideoPlayer } from '@/components/monitor/video-player'
```

2. 添加状态和调用：
```typescript
const { getRandomChannel, loading } = useVideoChannels()
const [streamUrl, setStreamUrl] = useState<string | null>(null)

// 初始化时随机获取视频
useEffect(() => {
  if (!loading) {
    const channel = getRandomChannel('canteen')
    if (channel) {
      setStreamUrl(getStreamUrl(channel.id))
    }
  }
}, [loading])
```

3. 替换视频区域：
```typescript
{/* 视频区域 */}
<div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
  {streamUrl ? (
    <VideoPlayer streamUrl={streamUrl} isLoading={loading} />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <Camera className="w-16 h-16 text-slate-600 mx-auto mb-3" />
      <p className="text-slate-500 text-sm">等待视频信号...</p>
    </div>
  )}
  {/* 人数识别叠加层保留 */}
  <div className="absolute bottom-3 left-3 bg-black/70 rounded px-2 py-1 flex items-center gap-2">
    <Users className="w-4 h-4 text-blue-400" />
    <span className="text-white font-mono text-lg">{realtimeCount}</span>
    <span className="text-slate-400 text-xs">人</span>
  </div>
</div>
```

- [ ] **Step 2: 同样方式改造其他 4 个场景页面**

 shops-page.tsx → scene: 'street'
 dormitory-page.tsx → scene: 'dormitory'
 building-page.tsx → scene: 'building'
 gate-page.tsx → scene: 'gate'

- [ ] **Step 3: Commit**

```bash
git add apps/skybrain-web/src/pages/modules/scene/
git commit -m "feat: 场景页面接入 HLS 视频流"
```

---

## Chunk 4: 多路监控页面改造

### Task 6: 改造多路监控页面

**Files:**
- Modify: `apps/skybrain-web/src/pages/modules/monitor/multi-monitor-page.tsx`

- [ ] **Step 1: 改造 multi-monitor-page.tsx**

1. 导入：
```typescript
import { useVideoChannels, getStreamUrl } from '@/hooks/useVideoChannels'
```

2. 添加状态：
```typescript
const { getRandomChannels, loading, channels } = useVideoChannels()
const [droneVideoMap, setDroneVideoMap] = useState<Map<string, string>>(new Map())
```

3. 随机分配视频（每次刷新随机）：
```typescript
useEffect(() => {
  if (!loading && channels.length >= 9) {
    const randomChannels = getRandomChannels(9)
    const newMap = new Map<string, string>()

    activeDrones.forEach((drone, index) => {
      if (randomChannels[index]) {
        newMap.set(drone.id, getStreamUrl(randomChannels[index].id))
      }
    })

    setDroneVideoMap(newMap)
  }
}, [loading, activeDrones, channels])
```

4. 传递给 VideoGrid：
```typescript
<VideoGrid
  drones={drones}
  onFullscreen={handleFullscreen}
  videoMap={droneVideoMap}
/>
```

- [ ] **Step 2: 改造 VideoGrid 组件支持 videoMap**

读取现有 VideoGrid 代码，添加 videoMap prop 并传递给每个 VideoCard：

```typescript
interface VideoGridProps {
  drones: Drone[]
  onFullscreen: (drone: Drone) => void
  videoMap?: Map<string, string>  // 新增
}
```

在 VideoCard 中使用：
```typescript
<VideoPlayer streamUrl={videoMap?.get(drone.id)} />
```

- [ ] **Step 3: Commit**

```bash
git add apps/skybrain-web/src/pages/modules/monitor/multi-monitor-page.tsx
git add apps/skybrain-web/src/components/monitor/video-grid.tsx
git commit -m "feat: 多路监控页面随机分配视频流"
```

---

## 验收检查清单

- [ ] 后端 `/api/channels` 返回正确 JSON 格式
- [ ] 5 个场景页面能播放对应场景的视频
- [ ] 多路监控 9 个无人机各自播放不同的视频流
- [ ] 刷新页面时随机分配结果会变化
- [ ] 视频加载失败时显示友好提示