// AI模块类型定义

// AI消息
export interface AIMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  isLoading?: boolean
  error?: string
}

// 语音指令结果
export interface CommandResult {
  id: string
  command: string
  success: boolean
  message: string
  data?: Record<string, unknown>
  timestamp: Date
}

// 语音指令历史
export type CommandHistory = CommandResult

// 解析任务结果
export interface ParsedTask {
  taskType?: string
  taskTypeLabel?: string
  droneId?: string
  droneName?: string
  executeTime?: string
  location?: string
  description?: string
  routeName?: string
  routeId?: string
  confidence: number
}

// 快捷回复
export interface QuickReply {
  id: string
  label: string
  query: string
}

// API响应包装
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// 任务类型
export type TaskType = 'patrol' | 'inspection' | 'logistics' | 'emergency'

// 创建的任务（用于TaskConfirmForm）
export interface Task {
  id: string
  name: string
  type: TaskType
  droneId: string
  droneName?: string
  executeTime: string
  routeId?: string
  routeName?: string
  description?: string
  priority?: 'low' | 'normal' | 'high'
  status?: 'pending' | 'executing' | 'completed' | 'failed'
  createdAt?: Date
}