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

  setTasks: (tasks) => set((state) => ({
    tasks,
    pagination: { ...state.pagination, total: tasks.length }
  })),
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