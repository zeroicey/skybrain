# 监控组件 (Monitor Components)

> 用于视频监控和播放的组件

---

## 组件清单

| 序号 | 组件名称 | 说明 |
|------|----------|------|
| 1 | `VideoPlayer` | 视频播放组件 |
| 2 | `LiveStream` | 实时视频流播放器 |
| 3 | `VideoGrid` | 视频网格（多路播放） |
| 4 | `VideoControls` | 视频播放控制条 |
| 5 | `VideoTimeline` | 录像时间轴 |
| 6 | `Snapshot` | 截图组件 |

---

## 组件说明

### VideoPlayer
- 通用视频播放组件，支持多种格式
- 支持：HLS、RTMP、FLV、WebRTC
- Props: `src`, `protocol`, `autoplay`, `controls`

### LiveStream
- 实时视频流播放器
- 支持：低延迟直播、自动重连
- Props: `streamUrl`, `latency`, `onStatusChange`

### VideoGrid
- 多路视频网格展示
- 支持：1x1、1x2、2x2、3x3 布局
- Props: `videos`, `layout`, `onVideoClick`

### VideoControls
- 视频播放控制条
- 支持：播放/暂停、音量、进度、全屏
- Props: `playing`, `volume`, `currentTime`, `duration`

### VideoTimeline
- 录像回放时间轴
- 支持：时间段选择、拖拽定位
- Props: `records`, `currentTime`, `onSelect`

### Snapshot
- 视频截图组件
- 支持：一键截图、下载
- Props: `videoRef`, `filename`, `onSnapshot`

---

*文档更新时间: 2026-03-14*