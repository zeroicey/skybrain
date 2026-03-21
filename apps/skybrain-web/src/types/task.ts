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

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  patrol: '巡逻',
  inspection: '巡检',
  support: '保障',
  delivery: '配送',
  rescue: '搜救',
  custom: '自定义'
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: '待执行',
  running: '执行中',
  completed: '已完成',
  failed: '失败',
  cancelled: '已取消'
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: '低',
  normal: '普通',
  high: '高',
  urgent: '紧急'
}