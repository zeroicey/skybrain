# SkyBrain 前端文件夹架构

> 基于 React + Bun + shadcn/ui + Tailwind CSS + React Router v7 的推荐项目结构

---

## 目录概览

```
src/
├── routes/                      # React Router v7 路由配置 (Data Mode)
│   ├── __root.tsx              # 根路由布局
│   ├── _auth.tsx               # 认证布局 (登录/注册)
│   ├── _auth.login.tsx
│   ├── _auth.register.tsx
│   ├── _app.tsx                # 应用布局 (侧边栏+顶部+内容)
│   ├── dashboard.tsx           # 仪表盘 index
│   ├── dashboard.security.tsx  # 安保态势
│   ├── dashboard.flight.tsx   # 飞行态势
│   ├── monitor.tsx             # 实时监控 index
│   ├── monitor.live.tsx        # 视频监控
│   ├── monitor.playback.tsx    # 监控回放
│   ├── monitor.multi.tsx       # 多路监控
│   ├── tasks.tsx               # 任务管理 index
│   ├── tasks.create.tsx       # 任务创建
│   ├── tasks.schedule.tsx      # 定时任务
│   ├── tasks.logs.tsx          # 任务日志
│   ├── security.patrol.tsx     # 周界巡逻
│   ├── security.intrusion.tsx  # 入侵告警
│   ├── security.emergency.tsx  # 应急响应
│   ├── devices.drones.tsx     # 无人机列表
│   ├── devices.drones.$id.tsx  # 无人机详情
│   ├── devices.hangars.tsx    # 机库管理
│   ├── devices.batteries.tsx   # 电池管理
│   ├── devices.maintenance.tsx  # 维护记录
│   ├── flight.routes.tsx       # 航线管理
│   ├── flight.routes.edit.$id.tsx # 航线编辑
│   ├── flight.no-fly.tsx       # 禁飞管理
│   ├── flight.monitor.tsx      # 实时监控
│   ├── flight.records.tsx      # 飞行记录
│   ├── analytics.tsx           # 数据分析 index
│   ├── analytics.overview.tsx  # 数据大屏
│   ├── analytics.reports.tsx   # 运营报表
│   ├── settings.tsx            # 系统设置 index
│   ├── settings.users.tsx      # 用户管理
│   ├── settings.roles.tsx      # 角色权限
│   ├── settings.logs.tsx       # 操作日志
│   ├── settings.config.tsx     # 系统配置
│   ├── ai.tsx                  # AI交互 index
│   ├── ai.voice.tsx            # 语音控制
│   ├── ai.chat.tsx             # 智能问答
│   └── ai.task-create.tsx      # 自然语言任务创建
│
├── components/                   # 全局通用组件
│   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   │
│   ├── layout/                   # 布局组件 (01-layout)
│   │   ├── AppLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── BlankLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── MonitorLayout.tsx
│   │
│   ├── navigation/               # 导航组件 (02-navigation)
│   │   ├── TopNav.tsx
│   │   ├── SideMenu.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── TabNav.tsx
│   │   └── GoBack.tsx
│   │
│   ├── display/                  # 数据展示组件 (03-display)
│   │   ├── StatCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── TreeTable.tsx
│   │   ├── ListView.tsx
│   │   ├── CardList.tsx
│   │   ├── DescriptionList.tsx
│   │   ├── Timeline.tsx
│   │   ├── Progress.tsx
│   │   ├── Badge.tsx
│   │   ├── Tag.tsx
│   │   ├── Avatar.tsx
│   │   ├── Empty.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spin.tsx
│   │   └── Pagination.tsx
│   │
│   ├── forms/                    # 表单组件 (05-forms)
│   │   ├── SearchForm.tsx
│   │   ├── FilterForm.tsx
│   │   ├── TaskForm.tsx
│   │   ├── EventForm.tsx
│   │   ├── DeliveryForm.tsx
│   │   ├── RouteForm.tsx
│   │   ├── ConfigForm.tsx
│   │   └── ...
│   │
│   ├── map/                      # 地图组件 (06-map)
│   │   ├── MapView.tsx
│   │   ├── DroneMarker.tsx
│   │   ├── PatrolRoute.tsx
│   │   ├── NoFlyZoneEditor.tsx
│   │   ├── HeatMapOverlay.tsx
│   │   └── RouteEditor.tsx
│   │
│   ├── monitor/                  # 监控组件 (07-monitor)
│   │   ├── VideoPlayer.tsx
│   │   ├── VideoGrid.tsx
│   │   ├── VideoControls.tsx
│   │   ├── VideoTimeline.tsx
│   │   ├── DroneSelector.tsx
│   │   └── VideoPlayer.tsx
│   │
│   ├── alert/                   # 告警组件 (08-alert)
│   │   ├── AlertList.tsx
│   │   ├── AlertCard.tsx
│   │   ├── AlertFilter.tsx
│   │   ├── SeverityTag.tsx
│   │   └── AlertDetail.tsx
│   │
│   ├── drone/                   # 无人机控制组件 (09-drone)
│   │   ├── DroneCard.tsx
│   │   ├── DroneGrid.tsx
│   │   ├── DroneInfoPanel.tsx
│   │   ├── DroneStatus.tsx
│   │   ├── BatteryIndicator.tsx
│   │   ├── GimbalControl.tsx
│   │   ├── FlightControl.tsx
│   │   └── DroneDetail.tsx
│   │
│   ├── ai/                      # AI交互组件 (10-ai)
│   │   ├── ChatWindow.tsx
│   │   ├── VoiceInput.tsx
│   │   ├── VoiceVisualizer.tsx
│   │   ├── CommandHistory.tsx
│   │   └── NLPResult.tsx
│   │
│   ├── feedback/                # 反馈组件 (11-feedback)
│   │   ├── Message.tsx
│   │   ├── Notification.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── Toast.tsx
│   │   ├── Confirm.tsx
│   │   ├── Loading.tsx
│   │   ├── Result.tsx
│   │   ├── Progress.tsx
│   │   └── Tooltip.tsx
│   │
│   └── business/                 # 业务组件 (12-business)
│       ├── TaskCard.tsx
│       ├── EventCard.tsx
│       ├── RouteCard.tsx
│       ├── HangarCard.tsx
│       ├── BatteryCard.tsx
│       ├── MaintenanceRecord.tsx
│       ├── InspectionReport.tsx
│       ├── FlightRecord.tsx
│       ├── AlertRule.tsx
│       ├── UserCard.tsx
│       └── RoleCard.tsx
│
├── features/                    # 业务功能模块 (按页面模块组织)
│   ├── dashboard/               # 仪表盘模块 (14 pages)
│   │   ├── components/
│   │   │   ├── OverviewStats.tsx
│   │   │   ├── DroneMap.tsx
│   │   │   ├── AlertList.tsx
│   │   │   └── FlightTrend.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── monitor/                # 实时监控模块 (4 pages)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── tasks/                  # 任务管理模块 (6 pages)
│   │   ├── components/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   ├── TaskCreate.tsx
│   │   │   ├── TaskSchedule.tsx
│   │   │   └── TaskLogs.tsx
│   │   ├── hooks/
│   │   │   └── useTasks.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── security/               # 校园安保模块 (6 pages)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── inspection/             # 设施巡检模块 (5 pages)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── events/                 # 活动保障模块 (5 pages)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── environment/            # 环境监测模块 (4 pages)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── logistics/              # 物流配送模块 (5 pages)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── rescue/                 # 搜索救援模块 (4 pages)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── devices/                # 设备管理模块 (6 pages)
│   │   ├── components/
│   │   │   ├── DroneList.tsx
│   │   │   ├── DroneDetail.tsx
│   │   │   ├── HangarList.tsx
│   │   │   ├── BatteryList.tsx
│   │   │   ├── MaintenanceList.tsx
│   │   │   └── DeviceAdd.tsx
│   │   ├── hooks/
│   │   │   └── useDevices.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── flight/                 # 飞行管理模块 (6 pages)
│   │   ├── components/
│   │   │   ├── FlightPlanList.tsx
│   │   │   ├── RouteList.tsx
│   │   │   ├── RouteEditor.tsx
│   │   │   ├── NoFlyZoneManager.tsx
│   │   │   ├── FlightMonitor.tsx
│   │   │   └── FlightRecords.tsx
│   │   ├── hooks/
│   │   │   └── useFlight.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── analytics/              # 数据分析模块 (5 pages)
│   │   ├── components/
│   │   │   ├── DataOverview.tsx
│   │   │   ├── OperationsReport.tsx
│   │   │   ├── TaskAnalytics.tsx
│   │   │   ├── DeviceAnalytics.tsx
│   │   │   └── AlertAnalytics.tsx
│   │   ├── hooks/
│   │   │   └── useAnalytics.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── settings/               # 系统设置模块 (5 pages)
│   │   ├── components/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── RolePermission.tsx
│   │   │   ├── OperationLogs.tsx
│   │   │   ├── SystemConfig.tsx
│   │   │   └── NotificationSettings.tsx
│   │   ├── hooks/
│   │   │   └── useSettings.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── ai/                     # AI交互模块 (3 pages)
│       ├── components/
│       │   ├── VoiceControl.tsx
│       │   ├── AIChat.tsx
│       │   └── NLPTaskCreate.tsx
│       ├── hooks/
│       │   └── useAI.ts
│       ├── types/
│       │   └── index.ts
│       └── index.ts
│
├── lib/                        # 工具库
│   ├── api/                   # API 请求
│   │   ├── client.ts          # axios/fetch 实例
│   │   ├── endpoints.ts       # API 端点定义
│   │   └── types.ts           # API 类型
│   │
│   ├── utils/                  # 工具函数
│   │   ├── formatters.ts      # 格式化函数
│   │   ├── validators.ts      # 验证函数
│   │   ├── constants.ts       # 常量定义
│   │   └── helpers.ts         # 辅助函数
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useWebSocket.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   └── usePrevious.ts
│   │
│   └── constants/              # 常量配置
│       ├── permissions.ts
│       ├── routes.ts
│       └── config.ts
│
├── stores/                     # 状态管理
│   ├── authStore.ts           # 认证状态
│   ├── userStore.ts           # 用户状态
│   ├── droneStore.ts          # 无人机状态
│   ├── taskStore.ts           # 任务状态
│   ├── alertStore.ts          # 告警状态
│   └── settingsStore.ts       # 设置状态
│
├── types/                      # 全局类型定义
│   ├── index.ts
│   ├── api.d.ts
│   └── global.d.ts
│
├── config/                     # 配置文件
│   ├── site.ts
│   ├── theme.ts
│   └── constants.ts
│
├── assets/                     # 静态资源
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── styles/                     # 全局样式
    ├── globals.css
    └── theme.css
```

---

## 页面路由映射 (React Router v7)

| 页面模块 | 路由 | 文件位置 |
|----------|------|----------|
| 仪表盘 | `/dashboard` | `routes/dashboard.tsx` |
| 安保态势 | `/dashboard/security` | `routes/dashboard.security.tsx` |
| 飞行态势 | `/dashboard/flight` | `routes/dashboard.flight.tsx` |
| 视频监控 | `/monitor/live` | `routes/monitor.live.tsx` |
| 监控回放 | `/monitor/playback` | `routes/monitor.playback.tsx` |
| 多路监控 | `/monitor/multi` | `routes/monitor.multi.tsx` |
| 任务列表 | `/tasks` | `routes/tasks.tsx` |
| 任务创建 | `/tasks/create` | `routes/tasks.create.tsx` |
| 定时任务 | `/tasks/schedule` | `routes/tasks.schedule.tsx` |
| 周界巡逻 | `/security/patrol` | `routes/security.patrol.tsx` |
| 入侵告警 | `/security/intrusion` | `routes/security.intrusion.tsx` |
| 应急响应 | `/security/emergency` | `routes/security.emergency.tsx` |
| 设备管理 | `/devices/drones` | `routes/devices.drones.tsx` |
| 无人机详情 | `/devices/drones/:id` | `routes/devices.drones.$id.tsx` |
| 机库管理 | `/devices/hangars` | `routes/devices.hangars.tsx` |
| 航线管理 | `/flight/routes` | `routes/flight.routes.tsx` |
| 航线编辑 | `/flight/routes/edit/:id` | `routes/flight.routes.edit.$id.tsx` |
| 禁飞管理 | `/flight/no-fly` | `routes/flight.no-fly.tsx` |
| 数据大屏 | `/analytics/overview` | `routes/analytics.overview.tsx` |
| 用户管理 | `/settings/users` | `routes/settings.users.tsx` |
| 角色权限 | `/settings/roles` | `routes/settings.roles.tsx` |
| 语音控制 | `/ai/voice` | `routes/ai.voice.tsx` |
| 智能问答 | `/ai/chat` | `routes/ai.chat.tsx` |
| 任务创建 | `/ai/task-create` | `routes/ai.task-create.tsx` |

---

## 组件组织原则

### 1. 层级划分
- **UI 组件** (`components/ui/`): 纯展示组件，无业务逻辑，来源于 shadcn/ui
- **业务组件** (`components/business/`): 包含部分业务逻辑的可复用组件
- **页面组件** (`features/*/components/`): 特定页面模块的专用组件

### 2. 功能模块划分
每个 `features/` 下的模块包含：
- `components/`: 页面级组件
- `hooks/`: 专用 hooks
- `types/`: 类型定义
- `index.ts`: 模块导出

### 3. 命名规范
- 组件文件: `PascalCase` (如 `DroneCard.tsx`)
- Hook 文件: `camelCase` 开头 (如 `useDrone.ts`)
- 类型文件: `camelCase` (如 `types.ts`)

---

## 技术栈配置

### 核心依赖
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^7.x",
    "zustand": "^4.x",
    "tailwindcss": "^3.4.x",
    "shadcn-ui": "latest",
    "@mui/x-charts": "^7.x",
    "@dnd-kit/core": "^6.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "leaflet": "^1.9.x",
    "video.js": "^8.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "bun": "latest"
  }
}
```

---

## 状态管理建议

| 场景 | 推荐方案 |
|------|----------|
| 用户认证 | Zustand (`authStore`) + React Router `loader` |
| 无人机实时状态 | WebSocket + Zustand |
| 任务列表 | React Router `loader` + `action` |
| 告警状态 | WebSocket + Zustand |
| 表单状态 | React Hook Form |
| UI 状态 (侧边栏等) | Zustand |

### React Router v7 Data Mode

```tsx
// routes/tasks.tsx
import { LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  const tasks = await fetchTasks();
  return { tasks };
}

export default function TasksPage({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;
  return <TaskList tasks={tasks} />;
}
```

---

*文档更新时间: 2026-03-17*