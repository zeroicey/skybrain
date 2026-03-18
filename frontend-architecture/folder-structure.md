# SkyBrain 前端文件夹架构

> 基于 React + Bun + shadcn/ui + Tailwind CSS + React Router v7 的推荐项目结构
>
> **架构模式**: 混合架构 - **分层架构 (Layered)** + **按功能切片 (Feature-Sliced Design)**

---

## 架构设计理念

在构建中大型 React 项目时，良好的目录架构是保证代码可维护性、可扩展性和团队协作效率的关键。

对于 SkyBrain 这样的中大型无人机智能管控系统，我们采用目前业界最主流且被广泛推荐的**混合模式**，结合了：
- **分层架构**: 按技术职责分层（assets, components, hooks, utils 等）
- **按功能划分**: 核心业务按功能模块高内聚聚在 `features/` 下

这种架构的优势：
1. **高内聚，低耦合**: 删除一个功能只需要删除整个 `features/` 文件夹，无残留依赖
2. **清晰的边界限制**: 通过 `features/*/index.ts` 统一出口，强制模块隔离
3. **路由集中管理**: 所有路由配置中心化，便于维护和权限控制
4. **页面组件轻量化**: `pages/` 只负责拼装，不包含业务逻辑

---

## 📁 核心目录结构

```text
src/
├── assets/                 # 静态资源 (图片, 图标, 全局字体)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/             # 全局公共组件 (纯 UI 组件，无业务逻辑)
│   ├── ui/                 # shadcn/ui 基础组件 (button, card, table 等)
│   ├── layout/             # 布局组件
│   │   ├── AppLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── MonitorLayout.tsx
│   ├── navigation/         # 导航组件
│   │   ├── TopNav.tsx
│   │   ├── SideMenu.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── TabNav.tsx
│   ├── display/            # 数据展示通用组件
│   │   ├── StatCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── Pagination.tsx
│   │   └── ...
│   ├── feedback/           # 反馈组件
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   └── Confirm.tsx
│   └── **/*.tsx            # 其他全局通用组件
│
├── config/                 # 全局配置 (环境变量映射, 常量, 主题配置)
│   ├── site.ts
│   ├── theme.ts
│   └── constants.ts
│
├── features/               # ⭐️ 核心：按业务功能划分的模块 (高内聚)
│   │
│   ├── auth/               # 身份认证模块
│   │   ├── api/            # 该模块专属的 API 请求
│   │   ├── components/     # 该模块专属的组件 (LoginForm, RegisterForm)
│   │   ├── hooks/          # 该模块专属的 Hooks
│   │   ├── store/          # 该模块的局部状态 (如果需要)
│   │   ├── types/          # 该模块的类型定义
│   │   └── index.ts        # 模块入口：统一对外暴露接口 (Public API)
│   │
│   ├── dashboard/          # 仪表盘模块 (概览 + 态势展示)
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── OverviewStats.tsx
│   │   │   ├── DroneMap.tsx
│   │   │   ├── AlertList.tsx
│   │   │   └── FlightTrend.tsx
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── monitor/            # 实时监控模块
│   │   ├── api/
│   │   ├── components/     # VideoPlayer, VideoGrid, DroneSelector
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── tasks/              # 任务管理模块
│   │   ├── api/
│   │   ├── components/     # TaskList, TaskDetail, TaskCreate, TaskSchedule
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── security/           # 校园安保模块
│   │   ├── api/
│   │   ├── components/     # PatrolRoute, IntrusionAlerts, EmergencyResponse
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── devices/            # 设备管理模块 (无人机 + 机库 + 电池)
│   │   ├── api/
│   │   ├── components/     # DroneList, DroneDetail, HangarList, BatteryList
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── flight/             # 飞行管理模块 (航线 + 禁飞 + 记录)
│   │   ├── api/
│   │   ├── components/     # RouteList, RouteEditor, NoFlyZoneManager
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── inspection/         # 设施巡检模块
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── events/             # 活动保障模块
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── environment/        # 环境监测模块
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── logistics/          # 物流配送模块
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── rescue/             # 搜索救援模块
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── analytics/          # 数据分析模块
│   │   ├── api/
│   │   ├── components/     # DataOverview, OperationsReport, TaskAnalytics
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── settings/           # 系统设置模块
│   │   ├── api/
│   │   ├── components/     # UserManagement, RolePermission, SystemConfig
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── ai/                 # AI 交互模块 (语音 + 聊天 + NLP 任务创建)
│       ├── api/
│       ├── components/     # VoiceControl, AIChat, NLPTaskCreate
│       ├── hooks/
│       ├── types/
│       └── index.ts
│
├── hooks/                  # 全局自定义 Hooks (跨模块复用)
│   ├── useWebSocket.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   └── usePrevious.ts
│
├── layouts/                # 页面级布局组件
│   ├── RootLayout.tsx
│   ├── AuthLayout.tsx
│   └── AppLayout.tsx
│
├── pages/                  # 📄 路由级别的页面组件 (极度轻量化)
│   │
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── DashboardSecurityPage.tsx
│   ├── DashboardFlightPage.tsx
│   ├── MonitorLivePage.tsx
│   ├── MonitorPlaybackPage.tsx
│   ├── MonitorMultiPage.tsx
│   ├── TasksPage.tsx
│   ├── TasksCreatePage.tsx
│   ├── TasksSchedulePage.tsx
│   ├── TasksLogsPage.tsx
│   ├── SecurityPatrolPage.tsx
│   ├── SecurityIntrusionPage.tsx
│   ├── SecurityEmergencyPage.tsx
│   ├── DevicesDronesPage.tsx
│   ├── DevicesDroneDetailPage.tsx
│   ├── DevicesHangarsPage.tsx
│   ├── DevicesBatteriesPage.tsx
│   ├── FlightRoutesPage.tsx
│   ├── FlightRouteEditPage.tsx
│   ├── FlightNoFlyPage.tsx
│   ├── FlightMonitorPage.tsx
│   ├── AnalyticsOverviewPage.tsx
│   ├── SettingsUsersPage.tsx
│   ├── AIVoicePage.tsx
│   ├── AIChatPage.tsx
│   └── NotFoundPage.tsx
│
├── routes/                 # ⭐️ React Router v7 路由配置中心
│   ├── index.tsx           # 路由主入口：创建和导出 Router 实例
│   ├── publicRoutes.tsx    # 公共路由配置 (登录、注册、404)
│   ├── privateRoutes.tsx   # 私有/鉴权路由配置 (需要登录)
│   └── guards/             # 路由守卫/拦截器
│       └── AuthGuard.tsx   # 检查登录状态并重定向
│
├── services/               # 全局 API 服务 (或 api/)
│   ├── client.ts           # Axios/Fetch 实例封装 + 拦截器
│   ├── endpoints.ts        # API 端点常量定义
│   └── types.ts            # API 全局类型定义
│
├── store/                  # 全局状态管理 (Zustand)
│   ├── authStore.ts         # 认证状态
│   ├── userStore.ts         # 用户状态
│   ├── droneStore.ts        # 无人机实时状态
│   ├── taskStore.ts         # 任务状态
│   ├── alertStore.ts        # 告警状态
│   └── settingsStore.ts     # 设置状态
│
├── types/                  # 全局类型定义
│   ├── index.ts
│   ├── api.d.ts
│   └── global.d.ts
│
├── utils/                  # 全局工具函数
│   ├── formatters.ts       # 格式化函数 (日期、数字等)
│   ├── validators.ts       # 验证函数
│   └── helpers.ts          # 辅助函数
│
├── styles/                 # 全局样式
│   ├── globals.css
│   └── theme.css
│
├── App.tsx                 # 根组件 (注入 Provider 等)
└── main.tsx                # 入口文件 (挂载 React 树)
```

---

## 🛣️ React Router v7 架构与集成设计

在中大型项目中，路由不应该零散地分布在各个组件中，而应该有**中心化的配置**。React Router v7 Data Mode 基于对象的路由配置是最佳实践。

### 路由配置结构

```text
src/routes/
├── index.tsx          # 路由主入口，创建和导出 Router 实例
├── publicRoutes.tsx   # 公共路由配置 (登录、注册、404)
├── privateRoutes.tsx  # 私有/鉴权路由配置 (需要登录才能访问)
└── guards/            # 路由守卫/拦截器组件
    └── AuthGuard.tsx  # 检查登录状态并重定向的包裹组件
```

### 路由配置示例 (`routes/index.tsx`)

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import AuthGuard from './guards/AuthGuard';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';
import NotFoundPage from '@/pages/NotFoundPage';

// 将路由划分为不同层级和布局
const router = createBrowserRouter([
  {
    // 根路由
    element: <RootLayout />,
    children: [
      // 公共路由：使用 AuthLayout 布局 (登录/注册)
      {
        element: <AuthLayout />,
        children: publicRoutes,
      },
      // 私有路由：使用 AppLayout 布局，并用 AuthGuard 保护
      {
        element: (
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        ),
        children: privateRoutes,
      },
      // 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### 路由守卫示例 (`routes/guards/AuthGuard.tsx`)

```tsx
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

### Pages 与 Features 的协作模式

中大型架构的一个核心痛点是：**组件越来越臃肿**。

为了解决这个问题，`pages/` 目录下的文件应该保持极度的"轻量"。它们的作用仅仅是：**从 `features/` 引入业务模块，并与当前的路由参数建立连接。**

示例 `src/pages/DevicesDroneDetailPage.tsx`:

```tsx
import { useParams } from 'react-router';
import { DroneDetail } from '@/features/devices';

// Page 组件很薄，只负责路由参数传递和组件拼装
export default function DevicesDroneDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>无效的设备 ID</div>;

  return <DroneDetail droneId={id} />;
}
```

---

## 📋 页面 - 路由 - 文件映射表

| 页面模块 | 路由路径 | Page 文件位置 | Feature 模块 |
|----------|---------|--------------|-------------|
| 登录 | `/login` | `pages/LoginPage.tsx` | `features/auth` |
| 注册 | `/register` | `pages/RegisterPage.tsx` | `features/auth` |
| 仪表盘概览 | `/dashboard` | `pages/DashboardPage.tsx` | `features/dashboard` |
| 安保态势 | `/dashboard/security` | `pages/DashboardSecurityPage.tsx` | `features/dashboard` |
| 飞行态势 | `/dashboard/flight` | `pages/DashboardFlightPage.tsx` | `features/dashboard` |
| 视频监控 | `/monitor/live` | `pages/MonitorLivePage.tsx` | `features/monitor` |
| 监控回放 | `/monitor/playback` | `pages/MonitorPlaybackPage.tsx` | `features/monitor` |
| 多路监控 | `/monitor/multi` | `pages/MonitorMultiPage.tsx` | `features/monitor` |
| 任务列表 | `/tasks` | `pages/TasksPage.tsx` | `features/tasks` |
| 任务创建 | `/tasks/create` | `pages/TasksCreatePage.tsx` | `features/tasks` |
| 定时任务 | `/tasks/schedule` | `pages/TasksSchedulePage.tsx` | `features/tasks` |
| 任务日志 | `/tasks/logs` | `pages/TasksLogsPage.tsx` | `features/tasks` |
| 周界巡逻 | `/security/patrol` | `pages/SecurityPatrolPage.tsx` | `features/security` |
| 入侵告警 | `/security/intrusion` | `pages/SecurityIntrusionPage.tsx` | `features/security` |
| 应急响应 | `/security/emergency` | `pages/SecurityEmergencyPage.tsx` | `features/security` |
| 无人机列表 | `/devices/drones` | `pages/DevicesDronesPage.tsx` | `features/devices` |
| 无人机详情 | `/devices/drones/:id` | `pages/DevicesDroneDetailPage.tsx` | `features/devices` |
| 机库管理 | `/devices/hangars` | `pages/DevicesHangarsPage.tsx` | `features/devices` |
| 电池管理 | `/devices/batteries` | `pages/DevicesBatteriesPage.tsx` | `features/devices` |
| 航线管理 | `/flight/routes` | `pages/FlightRoutesPage.tsx` | `features/flight` |
| 航线编辑 | `/flight/routes/edit/:id` | `pages/FlightRouteEditPage.tsx` | `features/flight` |
| 禁飞管理 | `/flight/no-fly` | `pages/FlightNoFlyPage.tsx` | `features/flight` |
| 实时飞行监控 | `/flight/monitor` | `pages/FlightMonitorPage.tsx` | `features/flight` |
| 数据大屏 | `/analytics/overview` | `pages/AnalyticsOverviewPage.tsx` | `features/analytics` |
| 用户管理 | `/settings/users` | `pages/SettingsUsersPage.tsx` | `features/settings` |
| 语音控制 | `/ai/voice` | `pages/AIVoicePage.tsx` | `features/ai` |
| 智能问答 | `/ai/chat` | `pages/AIChatPage.tsx` | `features/ai` |

---

## 📐 模块组织原则

### 1. 层级划分

| 层级 | 位置 | 职责 |
|------|------|------|
| **全局 UI 组件** | `components/ui/` | 纯展示组件，无业务逻辑，来源于 shadcn/ui |
| **全局通用组件** | `components/**/` | 跨模块复用的通用组件，包含少量通用逻辑 |
| **功能模块** | `features/*/` | 按业务功能划分，高内聚，包含该功能的所有代码 |
| **页面组件** | `pages/` | 轻薄，只负责路由参数传递和组件拼装 |
| **全局工具** | `utils/`, `hooks/` | 跨模块复用的工具和 Hooks |

### 2. Feature 模块结构

每个 `features/*` 下的功能模块遵循一致的结构：

```
features/auth/
├── api/            # 该模块专属的 API 请求
├── components/     # 该模块专属的组件
├── hooks/          # 该模块专属的 Hooks
├── store/          # 该模块的局部状态 (可选)
├── types/          # 该模块的类型定义
└── index.ts        # 模块入口：统一对外暴露接口 (Public API)
```

**设计原则**: 通过 `index.ts` (Barrel File) 强制规定模块的外部可用接口。

✅ **正确用法**:
```ts
// 从模块入口引入，遵循边界限制
import { LoginForm } from '@/features/auth';
```

❌ **禁止用法**:
```ts
// 直接深入模块内部，破坏模块边界
import LoginForm from '@/features/auth/components/LoginForm';
```

### 3. 命名规范

- 组件文件: `PascalCase` (如 `DroneCard.tsx`)
- Hook 文件: `camelCase` 开头 (如 `useDashboard.ts`)
- 类型文件: `camelCase` (如 `types.ts`)
- 页面文件: `FeatureNamePage.tsx` (如 `DevicesDroneDetailPage.tsx`)

---

## 设计系统 (由 UI/UX Pro Max 生成)

**项目**: SkyBrain - 无人机智能管控系统

### 设计模式

- **模式**: Data-Dense + Drill-Down (高密度数据展示 + 下钻查询)
- **风格**: Data-Dense Dashboard (适合多图表、多数据表格的运营仪表盘)
- **特点**: 空间高效，最大数据可见性，适合企业级运营管控

### 配色方案

| 角色 | Hex 颜色 | 说明 |
|------|----------|------|
| Primary | `#7C3AED` | 主色调：紫色，代表科技与智能 |
| Secondary | `#A78BFA` | 辅助色 |
| CTA | `#F97316` | 行动按钮：橙色，突出操作 |
| Background | `#FAF5FF` | 背景色 |
| Text | `#4C1D95` | 文本色 |

*紫色+橙色组合：传递科技兴奋感与行动力*

### 字体方案

- **标题**: `Fira Code` (等宽编程字体，适合技术感仪表盘)
- **正文**: `Fira Sans` (清晰易读)
- Google Fonts 引入:

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

### 核心交互效果

- Hover 工具提示
- 图表点击缩放
- 表格行高亮
- 平滑筛选动画
- 数据加载 spinner

### 应该避免

- ❌ 华丽繁复的装饰设计
- ❌ 缺少筛选能力的静态展示

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
| 用户认证 | 全局 Zustand `authStore` + React Router `loader` |
| 无人机实时状态 | WebSocket + 全局 Zustand `droneStore` |
| 告警状态 | WebSocket + 全局 Zustand `alertStore` |
| 页面数据 | React Router `loader` + `action` |
| 模块局部状态 | 模块内 `features/*/store/` |
| 表单状态 | React Hook Form (组件内局部状态) |
| UI 状态 (侧边栏展开等) | 全局 Zustand `settingsStore` |

---

## 路径别名配置

推荐在 `tsconfig.json` 中配置路径别名，简化导入：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/routes/*": ["./src/routes/*"],
      "@/services/*": ["./src/services/*"],
      "@/store/*": ["./src/store/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/config/*": ["./src/config/*"]
    }
  }
}
```

---

## 为什么这种架构适合 SkyBrain？

1. **团队协作友好**: 不同开发者可以并行开发不同的 `features/` 模块，冲突少
2. **易于功能移除**: 如果需要删除"物流配送"功能，只需要删除 `features/logistics` 文件夹即可，不会在各个目录留下散落的代码
3. **清晰的依赖关系**: 模块边界清晰，通过 `index.ts` 控制对外接口，减少"意大利面条"式依赖
4. **路由可维护性**: 所有路由集中在 `src/routes/` 管理，权限控制和布局调整一目了然
5. **可扩展性**: 新增功能只需要新增 `features/` 下的文件夹，不影响现有代码

---

*文档更新时间: 2026-03-18*
