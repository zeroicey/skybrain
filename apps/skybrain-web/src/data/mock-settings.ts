export interface User {
  id: string
  username: string
  name: string
  avatar?: string
  role: 'admin' | 'security' | 'operations' | 'teacher' | 'student'
  department: string
  status: 'active' | 'inactive'
  email: string
  phone?: string
  createdAt: string
}

export interface Role {
  id: string
  name: string
  description: string
  userCount: number
  permissions: string[]
}

export interface Log {
  id: string
  operator: string
  operatorName: string
  action: string
  target: string
  ip: string
  timestamp: string
  status: 'success' | 'failed'
  details?: string
}

export interface SystemConfig {
  // 基础配置
  systemName: string
  systemDescription: string
  dataRetentionDays: number
  timezone: string
  language: string
  // 飞行配置
  minFlightAltitude: number
  maxFlightAltitude: number
  returnHomeBatteryThreshold: number
  noFlyWeather: string[]
  // 告警配置
  alertEnabled: boolean
  alertEmail: string
  alertPhone: string
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: '张三',
    role: 'admin',
    department: '信息中心',
    status: 'active',
    email: 'admin@school.edu',
    phone: '13800138000',
    createdAt: '2025-01-15 10:00:00'
  },
  {
    id: '2',
    username: 'security01',
    name: '李四',
    role: 'security',
    department: '安保部',
    status: 'active',
    email: 'security@school.edu',
    phone: '13800138001',
    createdAt: '2025-02-01 09:30:00'
  },
  {
    id: '3',
    username: 'teacher01',
    name: '王五',
    role: 'teacher',
    department: '教务处',
    status: 'active',
    email: 'teacher@school.edu',
    phone: '13800138002',
    createdAt: '2025-02-15 14:20:00'
  },
  {
    id: '4',
    username: 'ops01',
    name: '赵六',
    role: 'operations',
    department: '运维部',
    status: 'active',
    email: 'ops@school.edu',
    phone: '13800138003',
    createdAt: '2025-03-01 11:00:00'
  },
  {
    id: '5',
    username: 'student01',
    name: '钱七',
    role: 'student',
    department: '计算机系',
    status: 'inactive',
    email: 'student@school.edu',
    createdAt: '2025-03-10 16:45:00'
  },
]

export const mockRoles: Role[] = [
  {
    id: '1',
    name: '管理员',
    description: '系统管理员，拥有全部权限',
    userCount: 2,
    permissions: ['*']
  },
  {
    id: '2',
    name: '安保人员',
    description: '负责安保监控和告警处理',
    userCount: 5,
    permissions: ['dashboard.view', 'monitor.view', 'monitor.control', 'alert.view', 'alert.handle']
  },
  {
    id: '3',
    name: '运维人员',
    description: '负责设备维护和系统运维',
    userCount: 3,
    permissions: ['device.view', 'device.edit', 'device.maintenance', 'flight.view', 'flight.edit']
  },
  {
    id: '4',
    name: '教师',
    description: '可查看监控和任务，不能控制',
    userCount: 10,
    permissions: ['dashboard.view', 'monitor.view', 'tasks.view', 'scenes.view']
  },
  {
    id: '5',
    name: '学生',
    description: '仅可查看部分监控画面',
    userCount: 50,
    permissions: ['dashboard.view', 'scenes.view']
  },
]

export const mockLogs: Log[] = [
  {
    id: '1',
    operator: 'admin',
    operatorName: '张三',
    action: '用户管理',
    target: '创建用户 "李四"',
    ip: '192.168.1.100',
    timestamp: '2026-03-31 14:30:25',
    status: 'success'
  },
  {
    id: '2',
    operator: 'security01',
    operatorName: '李四',
    action: '设备控制',
    target: '无人机-04 开始飞行',
    ip: '192.168.1.101',
    timestamp: '2026-03-31 14:25:10',
    status: 'success'
  },
  {
    id: '3',
    operator: 'admin',
    operatorName: '张三',
    action: '系统配置',
    target: '修改最高飞行高度为 120 米',
    ip: '192.168.1.100',
    timestamp: '2026-03-31 14:20:00',
    status: 'success'
  },
  {
    id: '4',
    operator: 'ops01',
    operatorName: '赵六',
    action: '设备维护',
    target: '无人机-02 完成维护',
    ip: '192.168.1.102',
    timestamp: '2026-03-31 14:15:30',
    status: 'success'
  },
  {
    id: '5',
    operator: 'admin',
    operatorName: '张三',
    action: '用户管理',
    target: '重置用户 "student01" 密码',
    ip: '192.168.1.100',
    timestamp: '2026-03-31 14:10:00',
    status: 'failed',
    details: '操作权限不足'
  },
]

export const defaultConfig: SystemConfig = {
  systemName: '校园无人机智能系统',
  systemDescription: '用于校园安保和巡检的智能无人机管理系统',
  dataRetentionDays: 90,
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  minFlightAltitude: 10,
  maxFlightAltitude: 120,
  returnHomeBatteryThreshold: 20,
  noFlyWeather: ['大风', '暴雨', '雷电'],
  alertEnabled: true,
  alertEmail: 'alert@school.edu',
  alertPhone: '13900139000'
}