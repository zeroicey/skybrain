# 多路监控页面 (Multi Monitor) 设计方案

> 创建日期: 2026-03-19

## 1. 概述

实现多路监控页面 (`/monitor/multi`)，支持同时监控多个无人机视频。

## 2. UI 组件设计

### 2.1 PageHeader 通用组件

```tsx
interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}
```

**布局**:
- 标题: 左侧, text-2xl font-bold
- 描述: 标题下方, text-sm text-muted-foreground
- actions: 右侧, flex gap-2

### 2.2 多路监控页面

**顶部**:
- PageHeader with title="多路监控", description="同时监控多个无人机视频"
- Actions: LayoutSwitcher + AddDroneButton + FullscreenButton

**布局切换**: Segmented Control (`1x2` | `2x2` | `3x3`)

**视频网格**: 响应式网格容器

**底部**: 快速添加常用监控点下拉

## 3. Mock 数据

```typescript
interface Drone {
  id: string
  name: string
  status: 'online' | 'offline' | 'warning'
  battery: number
  altitude: number
  streamUrl: string
}

type LayoutMode = '1x2' | '2x2' | '3x3'
```

## 4. 实现任务

1. 创建 PageHeader 组件
2. 创建 LayoutSwitcher 组件
3. 创建 VideoGrid 组件
4. 创建 VideoCard 组件
5. 创建 QuickAddDropdown 组件
6. 创建 MultiMonitorPage 页面
7. 配置路由
8. 添加 Mock 数据

## 5. 视觉规范

- 主题: Dark Mode (OLED)
- 主色调: #2563EB (Blue)
- 视频卡片: rounded-lg, border, hover:shadow-md
- 状态指示: 绿点=online, 红点=offline, 黄点=warning
- 过渡动画: 150-300ms