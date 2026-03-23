# 实时监控模块设计方案

> 完成日期: 2026-03-22

## 概述

实现实时监控模块的三个页面：视频监控（单路实时）、监控回放、多路监控（已存在）。使用模拟状态展示视频流。

## 页面结构

```
monitor/
├── live        → 视频监控（单路实时）
├── playback    → 监控回放
└── multi       → 多路监控（已实现）
```

---

## 页面1：视频监控 (Live)

**路由**: `/monitor/live`

### 布局

```
┌─────────────────────────────────────────────────────┐
│  无人机选择下拉框          画质切换    全屏按钮     │
├─────────────────────────────────────────────────────┤
│                                                     │
│                  视频播放区域                       │
│                  (16:9 居中)                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ◀◀  │  ▶/⏸  │  ▶▶  │  🔊  │  00:00/00:00  │  ⛶   │
├─────────────────────────────────────────────────────┤
│  📍 120m    ⚡ 12m/s    🔋 85%    位置: 教学区A    │
└─────────────────────────────────────────────────────┘
```

### 组件

| 组件 | 说明 |
|------|------|
| `DroneSelector` | 无人机下拉选择 |
| `VideoPlayer` | 视频播放区域（模拟状态） |
| `VideoControls` | 播放控制条 |
| `DroneInfoPanel` | 无人机信息面板 |
| `QualitySwitcher` | 画质切换（流畅/高清/4K） |
| `SnapshotButton` | 截图按钮 |
| `RecordButton` | 录像按钮 |

### 功能

1. 从下拉列表选择无人机
2. 视频区域显示模拟加载状态
3. 播放控制：播放/暂停/快进/快退
4. 音量控制
5. 画质切换
6. 截图功能（模拟）
7. 录像功能（模拟）
8. 全屏功能
9. 实时显示无人机状态（高度/速度/电池/位置）

---

## 页面2：监控回放 (Playback)

**路由**: `/monitor/playback`

### 布局

```
┌─────────────────────────────────────────────────────┐
│  无人机选择  │  日期选择  │  搜索                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│                  录像播放器                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ──●──────────────────── 录像时间轴                │
├─────────────────────────────────────────────────────┤
│  录像列表                                       │
│  ┌────────┬──────────┬──────────┬────────┬──────┐  │
│  │无人机  │ 开始时间 │ 结束时间 │ 时长   │操作  │  │
│  ├────────┼──────────┼──────────┼────────┼──────┤  │
│  │无人机1 │ 10:00    │ 10:30    │ 30分钟 │ ▶ 下载│  │
│  └────────┴──────────┴──────────┴────────┴──────┘  │
├─────────────────────────────────────────────────────┤
│  批量导出                        < 1 2 3 ... >     │
└─────────────────────────────────────────────────────┘
```

### 组件

| 组件 | 说明 |
|------|------|
| `DroneSelector` | 无人机筛选 |
| `DatePicker` | 日期选择 |
| `VideoPlayer` | 录像播放器 |
| `VideoTimeline` | 录像时间轴 |
| `RecordTable` | 录像列表表格 |
| `DownloadButton` | 单个下载 |
| `ExportButton` | 批量导出 |

### 功能

1. 按无人机筛选历史录像
2. 按日期筛选
3. 录像时间轴显示可回放时间段
4. 录像列表展示
5. 录像播放控制
6. 单个录像下载（模拟）
7. 批量导出（模拟）
8. 分页

---

## 数据模型

### 新增类型

```typescript
// 录像记录
interface VideoRecord {
  id: string
  droneId: string
  droneName: string
  startTime: string
  endTime: string
  duration: number // 秒
  fileSize: string
}

// 视频质量
type VideoQuality = '流畅' | '高清' | '4K'
```

### Mock 数据

创建 `mock-video-records.ts`，包含历史录像数据。

---

## 路由配置

```typescript
// router.ts 新增
const MonitorLivePage = lazy(() => import("@/pages/modules/monitor/live-page"))
const MonitorPlaybackPage = lazy(() => import("@/pages/modules/monitor/playback-page"))

{
  path: "monitor",
  children: [
    { path: "live", Component: MonitorLivePage },
    { path: "playback", Component: MonitorPlaybackPage },
    { path: "multi", Component: MultiMonitorPage }
  ]
}
```

---

## 文件结构

```
src/
├── components/
│   └── monitor/
│       ├── layout-switcher.tsx      (已存在)
│       ├── quick-add-dropdown.tsx    (已存在)
│       ├── video-card.tsx            (已存在)
│       ├── video-grid.tsx            (已存在)
│       ├── drone-selector.tsx        (新增)
│       ├── video-player.tsx          (新增)
│       ├── video-controls.tsx        (新增)
│       ├── drone-info-panel.tsx      (新增)
│       ├── video-timeline.tsx        (新增)
│       └── record-table.tsx          (新增)
├── data/
│   ├── mock-drones.ts                (已存在)
│   └── mock-video-records.ts        (新增)
├── pages/
│   └── modules/
│       └── monitor/
│           ├── live-page.tsx         (新增)
│           ├── playback-page.tsx     (新增)
│           └── multi-monitor-page.tsx (已存在)
├── stores/
│   └── monitor-store.ts              (已存在)
├── types/
│   └── drone.ts                      (已存在，需扩展)
└── router.ts                         (需修改)
```

---

## 技术实现

- **UI 框架**: shadcn/ui + Tailwind CSS
- **状态管理**: Zustand (现有 monitor-store 扩展)
- **路由**: React Router v6
- **包管理器**: Bun
- **图标**: Lucide React

---

## 验收标准

### 视频监控页面

- [ ] 可以从下拉列表选择无人机
- [ ] 视频区域显示模拟加载状态
- [ ] 播放控制按钮可用（显示模拟状态）
- [ ] 音量控制可用
- [ ] 画质切换可用
- [ ] 截图/录像/全屏按钮显示
- [ ] 无人机信息面板显示实时数据

### 监控回放页面

- [ ] 可以按无人机筛选
- [ ] 可以按日期筛选
- [ ] 录像列表正确显示
- [ ] 点击播放可以看模拟录像
- [ ] 下载按钮可用
- [ ] 分页正常工作

### 路由

- [ ] `/monitor/live` 正常访问
- [ ] `/monitor/playback` 正常访问
- [ ] 侧边栏链接正确