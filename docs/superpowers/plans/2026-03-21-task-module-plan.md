# 任务管理模块 (Task Module) 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 skybrain-web 的任务管理模块，包含 6 个页面：任务列表、任务详情、任务创建、任务编辑、定时任务、任务日志

**Architecture:** 遵循现有 monitor 模块的架构模式，使用统一 zustand store 管理状态，使用 shadcn/ui 组件

**Tech Stack:** React + TypeScript + Vite + shadcn/ui + zustand + React Router

---

## 文件结构

```
src/
├── pages/modules/task/                    # 6个页面
├── components/task/                       # 任务组件
├── stores/task-store.ts                   # 统一状态管理
├── data/mock-tasks.ts                     # Mock数据
├── types/task.ts                          # 类型定义
└── components/navbar/contents/            # Navbar内容
```

---

## Chunk 1: 基础建设 (类型 + Mock + Store)

### Task 1.1: 创建任务类型定义

**Files:**
- Create: `src/types/task.ts`

```typescript
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
  routePoints?: number[][]
  creator: string
  createdAt: string
  executor?: string
  executeTime?: string
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
  detail?: string
  timestamp: string
}
```

### Task 1.2: 创建 Mock 数据

**Files:**
- Create: `src/data/mock-tasks.ts`

- [ ] 编写包含 15-20 条模拟任务数据的文件，覆盖所有状态和类型

### Task 1.3: 创建任务 Store

**Files:**
- Create: `src/stores/task-store.ts`

```typescript
import { create } from 'zustand'
import type { Task, ScheduledTask, TaskLog, TaskType, TaskStatus, TaskLogEvent } from '@/types/task'

interface Pagination {
  page: number
  pageSize: number
  total: number
}

interface TaskStore {
  tasks: Task[]
  selectedTask: Task | null
  loading: boolean
  pagination: Pagination

  scheduledTasks: ScheduledTask[]
  logs: TaskLog[]

  filters: {
    type?: TaskType
    status?: TaskStatus
    droneId?: string
    dateRange?: [string, string]
    search?: string
  }

  logFilters: {
    taskId?: string
    droneId?: string
    event?: TaskLogEvent
    dateRange?: [string, string]
  }

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  selectTask: (task: Task | null) => void
  setFilters: (filters: Partial<TaskStore['filters']>) => void
  setPagination: (pagination: Partial<Pagination>) => void
  setLoading: (loading: boolean) => void
  batchDeleteTasks: (ids: string[]) => void
  batchExecuteTasks: (ids: string[]) => void

  setScheduledTasks: (tasks: ScheduledTask[]) => void
  addScheduledTask: (task: ScheduledTask) => void
  updateScheduledTask: (id: string, updates: Partial<ScheduledTask>) => void
  deleteScheduledTask: (id: string) => void
  toggleScheduledTask: (id: string) => void

  setLogs: (logs: TaskLog[]) => void
  addLog: (log: TaskLog) => void
  setLogFilters: (filters: Partial<TaskStore['logFilters']>) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedTask: null,
  loading: false,
  pagination: { page: 1, pageSize: 10, total: 0 },
  scheduledTasks: [],
  logs: [],
  filters: {},
  logFilters: {},

  setTasks: (tasks) => set({ tasks, pagination: { ...useTaskStore.getState().pagination, total: tasks.length } }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  selectTask: (task) => set({ selectedTask: task }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setPagination: (pagination) => set((state) => ({ pagination: { ...state.pagination, ...pagination } })),
  setLoading: (loading) => set({ loading }),
  batchDeleteTasks: (ids) => set((state) => ({
    tasks: state.tasks.filter((t) => !ids.includes(t.id))
  })),
  batchExecuteTasks: (ids) => set((state) => ({
    tasks: state.tasks.map((t) => ids.includes(t.id) ? { ...t, status: 'running' as TaskStatus } : t)
  })),

  setScheduledTasks: (scheduledTasks) => set({ scheduledTasks }),
  addScheduledTask: (task) => set((state) => ({ scheduledTasks: [...state.scheduledTasks, task] })),
  updateScheduledTask: (id, updates) => set((state) => ({
    scheduledTasks: state.scheduledTasks.map((t) => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteScheduledTask: (id) => set((state) => ({
    scheduledTasks: state.scheduledTasks.filter((t) => t.id !== id)
  })),
  toggleScheduledTask: (id) => set((state) => ({
    scheduledTasks: state.scheduledTasks.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t)
  })),

  setLogs: (logs) => set({ logs }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  setLogFilters: (filters) => set((state) => ({ logFilters: { ...state.logFilters, ...filters } })),
}))
```

---

## Chunk 2: 路由配置 + Navbar

### Task 2.1: 更新路由配置

**Files:**
- Modify: `src/router.ts:1-42`

- [ ] 添加 6 个页面组件的 lazy import
- [ ] 在 ModuleLayout 的 children 中添加 tasks 路由

```typescript
const TaskListPage = lazy(() => import("@/pages/modules/task/task-list-page"))
const TaskDetailPage = lazy(() => import("@/pages/modules/task/task-detail-page"))
const TaskCreatePage = lazy(() => import("@/pages/modules/task/task-create-page"))
const TaskEditPage = lazy(() => import("@/pages/modules/task/task-edit-page"))
const TaskSchedulePage = lazy(() => import("@/pages/modules/task/task-schedule-page"))
const TaskLogsPage = lazy(() => import("@/pages/modules/task/task-logs-page"))

// 在 children 中添加
{ path: "tasks", children: [
  { index: true, Component: TaskListPage },
  { path: "create", Component: TaskCreatePage },
  { path: ":id", Component: TaskDetailPage },
  { path: ":id/edit", Component: TaskEditPage },
  { path: "schedule", Component: TaskSchedulePage },
  { path: "logs", Component: TaskLogsPage },
]}
```

### Task 2.2: 创建 Navbar 内容组件

**Files:**
- Create: `src/components/navbar/contents/task-list.tsx`
- Create: `src/components/navbar/contents/task-detail.tsx`
- Create: `src/components/navbar/contents/task-create.tsx`
- Create: `src/components/navbar/contents/task-edit.tsx`
- Create: `src/components/navbar/contents/task-schedule.tsx`
- Create: `src/components/navbar/contents/task-logs.tsx`

- [ ] 修改 `src/components/navbar/index.tsx` 添加 task 路由的 Navbar 内容映射

---

## Chunk 3: 任务列表页面

### Task 3.1: 创建任务表格组件

**Files:**
- Create: `src/components/task/task-table.tsx`

- [ ] 使用 shadcn/ui Table 组件
- [ ] 显示：ID、任务名称、类型、状态、无人机、执行人、操作
- [ ] 状态使用 Badge 组件显示颜色标签

### Task 3.2: 创建任务筛选组件

**Files:**
- Create: `src/components/task/task-filters.tsx`

- [ ] 使用 Select 组件筛选：任务类型、状态
- [ ] 使用 Input 组件搜索
- [ ] 重置按钮

### Task 3.3: 创建任务列表页面

**Files:**
- Create: `src/pages/modules/task/task-list-page.tsx`

- [ ] 顶部：标题 + 新建任务按钮 + 导入/导出按钮
- [ ] 筛选表单
- [ ] 任务表格
- [ ] 底部：批量操作 + 分页器
- [ ] 使用 useTaskStore 获取和操作数据

---

## Chunk 4: 任务详情页面

### Task 4.1: 创建任务进度组件

**Files:**
- Create: `src/components/task/task-progress.tsx`

- [ ] 使用 shadcn/ui Progress 组件
- [ ] 显示：开始、当前进度、结束

### Task 4.2: 创建日志时间线组件

**Files:**
- Create: `src/components/task/task-log-timeline.tsx`

- [ ] 垂直时间线显示任务日志

### Task 4.3: 创建任务详情页面

**Files:**
- Create: `src/pages/modules/task/task-detail-page.tsx`

- [ ] 使用 useParams 获取任务 ID
- [ ] 顶部：返回按钮 + 任务名称 + 状态标签 + 操作菜单
- [ ] 左侧：任务进度 + 航线预览（占位）
- [ ] 右侧：任务基本信息 + 实时监控（占位）
- [ ] 底部：任务日志时间线

---

## Chunk 5: 任务创建页面 (分步向导)

### Task 5.1: 创建任务表单组件

**Files:**
- Create: `src/components/task/task-form.tsx`

- [ ] 基本信息表单：名称、类型、优先级、描述
- [ ] 航线选择：单选列表
- [ ] 参数设置：无人机选择、执行时间、重复、AI 设置

### Task 5.2: 创建任务创建页面

**Files:**
- Create: `src/pages/modules/task/task-create-page.tsx`

- [ ] 4 步向导：基本信息 -> 航线选择 -> 参数设置 -> 确认提交
- [ ] 使用步骤指示器（可使用 shadcn/ui stepper 或自定义）
- [ ] 最后提交时调用 store 的 addTask

---

## Chunk 6: 任务编辑页面

### Task 6.1: 创建任务编辑页面

**Files:**
- Create: `src/pages/modules/task/task-edit-page.tsx`

- [ ] 类似任务创建，预填现有数据
- [ ] 执行中的任务部分字段不可编辑
- [ ] 保存时调用 store 的 updateTask

---

## Chunk 7: 定时任务页面

### Task 7.1: 创建日历视图组件

**Files:**
- Create: `src/components/task/schedule-calendar.tsx`

- [ ] 周视图日历显示定时任务
- [ ] 点击日期查看当天任务

### Task 7.2: 创建列表视图组件

**Files:**
- Create: `src/components/task/schedule-list.tsx`

- [ ] 表格显示所有定时任务
- [ ] 启用/禁用开关

### Task 7.3: 创建定时任务页面

**Files:**
- Create: `src/pages/modules/task/task-schedule-page.tsx`

- [ ] 视图切换：日历/列表
- [ ] 新建定时任务按钮（打开 Dialog）
- [ ] 使用 store 的 scheduledTasks 数据

---

## Chunk 8: 任务日志页面

### Task 8.1: 创建任务日志页面

**Files:**
- Create: `src/pages/modules/task/task-logs-page.tsx`

- [ ] 筛选：任务ID、无人机、事件类型、时间范围
- [ ] 日志表格：时间、任务、无人机、事件、详情
- [ ] 分页器 + 统计
- [ ] 使用 store 的 logs 数据

---

## 总结

共 8 个 Chunk，24 个 Task。

每个 Task 完成后：
1. 验证代码无语法错误
2. 确认文件结构正确
3. 提交更改

---

**Plan complete and saved to `docs/superpowers/plans/2026-03-21-task-module-plan.md`. Ready to execute?**