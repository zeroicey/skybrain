# 任务管理模块 (Task Module) 设计文档

> 创建日期: 2026-03-21

## 1. 概述

实现 skybrain-web 的任务管理模块，包含 6 个页面：任务列表、任务详情、任务创建、任务编辑、定时任务、任务日志。遵循现有 monitor 模块的架构模式，使用统一 zustand store 管理状态，使用 shadcn/ui 组件。

## 2. 项目结构

```
src/
├── pages/modules/task/
│   ├── task-list-page.tsx         # 任务列表 (/tasks)
│   ├── task-detail-page.tsx       # 任务详情 (/tasks/:id)
│   ├── task-create-page.tsx       # 任务创建 (/tasks/create)
│   ├── task-edit-page.tsx         # 任务编辑 (/tasks/:id/edit)
│   ├── task-schedule-page.tsx     # 定时任务 (/tasks/schedule)
│   └── task-logs-page.tsx         # 任务日志 (/tasks/logs)
├── components/task/               # 任务相关组件
│   ├── task-table.tsx             # 任务表格
│   ├── task-filters.tsx           # 筛选表单
│   ├── task-form.tsx              # 任务表单（创建/编辑）
│   ├── task-progress.tsx          # 任务进度
│   ├── schedule-calendar.tsx      # 日历视图
│   ├── schedule-list.tsx          # 列表视图
│   └── task-log-timeline.tsx     # 日志时间线
├── stores/
│   └── task-store.ts              # 统一任务状态管理
├── data/
│   └── mock-tasks.ts              # Mock 任务数据
├── types/
│   └── task.ts                     # 任务类型定义
└── components/navbar/contents/
    ├── task-list.tsx              # 任务列表 Navbar
    ├── task-detail.tsx            # 任务详情 Navbar
    ├── task-create.tsx            # 任务创建 Navbar
    ├── task-edit.tsx              # 任务编辑 Navbar
    ├── task-schedule.tsx          # 定时任务 Navbar
    └── task-logs.tsx              # 任务日志 Navbar
```

## 3. 类型定义

```typescript
// src/types/task.ts
export type TaskType = 'patrol' | 'inspection' | 'support' | 'delivery' | 'rescue' | 'custom'
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent'
export type RepeatType = 'none' | 'daily' | 'weekly' | 'custom'

export interface Task {
  id: string
  name: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  description?: string
  droneId?: string
  droneName?: string
  routeId?: string
  routeName?: string
  routePoints?: number[][] // 航线详细路径坐标
  creator: string
  createdAt: string
  executor?: string
  executeTime?: string // 执行时间
  repeat: RepeatType
  aiSettings?: {
    realTimeAnalysis: boolean
    autoAlert: boolean
    notifyMethods: ('phone' | 'email')[]
  }
  startTime?: string
  endTime?: string
}

export interface ScheduledTask {
  id: string
  taskId: string
  taskName: string
  scheduleType: 'once' | 'daily' | 'weekly' | 'custom'
  cronExpression?: string
  time: string
  dayOfWeek?: number[]
  startDate?: string
  endDate?: string
  enabled: boolean
}

export type TaskLogEvent = 'started' | 'completed' | 'failed' | 'alert' | 'takeoff' | 'land'

export interface TaskLog {
  id: string
  taskId: string
  taskName: string
  droneId: string
  droneName: string
  event: TaskLogEvent
  message: string
  detail?: string // 日志详情
  timestamp: string
}
```

## 4. 状态管理

```typescript
// src/stores/task-store.ts
interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface TaskStore {
  // 任务列表
  tasks: Task[]
  selectedTask: Task | null
  loading: boolean
  pagination: Pagination

  // 定时任务
  scheduledTasks: ScheduledTask[]

  // 任务日志
  logs: TaskLog[]

  // 筛选条件
  filters: {
    type?: TaskType
    status?: TaskStatus
    droneId?: string
    dateRange?: [string, string]
    search?: string
  }

  // 日志筛选
  logFilters: {
    taskId?: string
    droneId?: string
    event?: TaskLogEvent
    dateRange?: [string, string]
  }

  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  selectTask: (task: Task | null) => void
  setFilters: (filters: Partial<TaskStore['filters']>) => void
  setPagination: (pagination: Partial<Pagination>) => void
  setLoading: (loading: boolean) => void

  // 批量操作
  batchDeleteTasks: (ids: string[]) => void
  batchExecuteTasks: (ids: string[]) => void

  // 定时任务
  setScheduledTasks: (tasks: ScheduledTask[]) => void
  addScheduledTask: (task: ScheduledTask) => void
  updateScheduledTask: (id: string, updates: Partial<ScheduledTask>) => void
  deleteScheduledTask: (id: string) => void
  toggleScheduledTask: (id: string) => void

  // 日志
  setLogs: (logs: TaskLog[]) => void
  addLog: (log: TaskLog) => void
  setLogFilters: (filters: Partial<TaskStore['logFilters']>) => void
}
```

## 5. 页面设计

### 5.1 任务列表 (/tasks)

- 顶部：标题 + 新建任务按钮 + 导入/导出按钮
- 筛选表单：任务类型、状态、无人机、时间范围、搜索、重置
- 任务表格：ID、任务名称、类型、状态、无人机、执行人、操作
- 底部：批量操作（批量删除、批量执行）+ 分页器

**功能**：
- 多维度筛选（任务类型、状态、无人机、时间）
- 关键字搜索
- 任务状态可视化（颜色标签）
- 批量操作（批量删除、批量执行）
- 导入/导出任务配置

### 5.2 任务详情 (/tasks/:id)

- 顶部：返回按钮 + 任务名称 + 状态标签 + 操作菜单（暂停/取消/重试）
- 左侧：任务进度条 + 航线预览地图
- 右侧：任务基本信息（类型、状态、无人机、时间、优先级）+ 实时监控（任务执行中时显示）
- 底部：任务日志时间线

### 5.3 任务创建 (/tasks/create)

- 4 步向导：
  1. 基本信息：名称、类型、优先级、描述
  2. 航线选择：选择预设航线
  3. 参数设置：无人机选择、执行时间、重复、AI 设置
  4. 确认提交

### 5.4 任务编辑 (/tasks/:id/edit)

- 与创建类似，预填现有数据
- 执行中的任务部分字段不可编辑

### 5.5 定时任务 (/tasks/schedule)

- 视图切换：日历视图 / 列表视图
- 新建定时任务按钮
- 启用/禁用开关

### 5.6 任务日志 (/tasks/logs)

- 筛选：任务ID、无人机、事件类型、时间范围
- 日志表格：时间、任务、无人机、事件、详情
- 底部：分页器 + 统计

## 6. 路由配置

```typescript
// router.ts 新增
const TaskListPage = lazy(() => import("@/pages/modules/task/task-list-page"))
const TaskDetailPage = lazy(() => import("@/pages/modules/task/task-detail-page"))
const TaskCreatePage = lazy(() => import("@/pages/modules/task/task-create-page"))
const TaskEditPage = lazy(() => import("@/pages/modules/task/task-edit-page"))
const TaskSchedulePage = lazy(() => import("@/pages/modules/task/task-schedule-page"))
const TaskLogsPage = lazy(() => import("@/pages/modules/task/task-logs-page"))

// children 中添加
{ path: "tasks", children: [
  { index: true, Component: TaskListPage },
  { path: "create", Component: TaskCreatePage },
  { path: ":id", Component: TaskDetailPage },
  { path: ":id/edit", Component: TaskEditPage },
  { path: "schedule", Component: TaskSchedulePage },
  { path: "logs", Component: TaskLogsPage },
]}
```

## 7. Mock 数据

创建 15-20 条模拟任务数据，覆盖所有状态和类型。

## 8. 实现顺序

1. 类型定义 + Mock 数据 + Store
2. 路由配置 + Navbar 内容
3. 任务列表页面
4. 任务详情页面
5. 任务创建页面
6. 任务编辑页面
7. 定时任务页面
8. 任务日志页面

## 9. 组件复用

- 使用 shadcn/ui 现有组件：Button, Card, Table, Dialog, Select, Input, DatePicker 等
- 参考 monitor 模块的组件组织方式