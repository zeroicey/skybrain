import type { Task, ScheduledTask, TaskLog } from '@/types/task'

const today = new Date()
const formatDate = (daysAgo: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

export const mockTasks: Task[] = [
  {
    id: '1',
    name: '日常校园巡逻',
    type: 'patrol',
    status: 'running',
    priority: 'high',
    description: '每日例行校园周界巡逻任务',
    droneId: '1',
    droneName: '无人机-01',
    routeId: 'r1',
    routeName: '校园周界巡逻',
    creator: '系统',
    createdAt: formatDate(0) + 'T08:00:00Z',
    executor: '系统',
    repeat: 'daily',
    aiSettings: {
      realTimeAnalysis: true,
      autoAlert: true,
      notifyMethods: ['phone', 'email']
    },
    startTime: formatDate(0) + 'T08:30:00Z'
  },
  {
    id: '2',
    name: '教学楼巡检',
    type: 'inspection',
    status: 'completed',
    priority: 'normal',
    description: '检查教学楼周边安全情况',
    droneId: '2',
    droneName: '无人机-02',
    routeId: 'r2',
    routeName: '教学楼巡检',
    creator: '张三',
    createdAt: formatDate(1) + 'T09:00:00Z',
    executor: '张三',
    repeat: 'none',
    aiSettings: {
      realTimeAnalysis: true,
      autoAlert: false,
      notifyMethods: ['email']
    },
    startTime: formatDate(1) + 'T10:00:00Z',
    endTime: formatDate(1) + 'T11:30:00Z'
  },
  {
    id: '3',
    name: '宿舍楼巡检',
    type: 'inspection',
    status: 'pending',
    priority: 'normal',
    description: '检查宿舍楼周边情况',
    routeId: 'r3',
    routeName: '宿舍楼巡检',
    creator: '李四',
    createdAt: formatDate(0) + 'T14:00:00Z',
    executor: '李四',
    repeat: 'weekly'
  },
  {
    id: '4',
    name: '运动会保障',
    type: 'support',
    status: 'pending',
    priority: 'high',
    description: '校园运动会期间空中监控保障',
    routeId: 'r4',
    routeName: '操场巡逻',
    creator: '王五',
    createdAt: formatDate(2) + 'T10:00:00Z',
    executor: '王五',
    repeat: 'none'
  },
  {
    id: '5',
    name: '实验楼安全检查',
    type: 'inspection',
    status: 'failed',
    priority: 'urgent',
    description: '实验楼重点区域安全检查',
    droneId: '3',
    droneName: '无人机-03',
    routeId: 'r5',
    routeName: '实验楼巡检',
    creator: '赵六',
    createdAt: formatDate(1) + 'T15:00:00Z',
    executor: '赵六',
    repeat: 'none',
    startTime: formatDate(1) + 'T16:00:00Z',
    endTime: formatDate(1) + 'T16:30:00Z'
  },
  {
    id: '6',
    name: '图书馆周边巡逻',
    type: 'patrol',
    status: 'completed',
    priority: 'normal',
    description: '图书馆周边例行巡逻',
    droneId: '4',
    droneName: '无人机-04',
    routeId: 'r1',
    routeName: '校园周界巡逻',
    creator: '系统',
    createdAt: formatDate(3) + 'T07:00:00Z',
    executor: '系统',
    repeat: 'daily',
    startTime: formatDate(3) + 'T07:30:00Z',
    endTime: formatDate(3) + 'T08:30:00Z'
  },
  {
    id: '7',
    name: '食堂配送任务',
    type: 'delivery',
    status: 'running',
    priority: 'high',
    description: '食堂到宿舍楼物资配送',
    droneId: '5',
    droneName: '无人机-05',
    routeId: 'r6',
    routeName: '配送航线',
    creator: '后勤部',
    createdAt: formatDate(0) + 'T11:00:00Z',
    executor: '后勤部',
    repeat: 'none',
    startTime: formatDate(0) + 'T11:30:00Z'
  },
  {
    id: '8',
    name: '夜间校园巡逻',
    type: 'patrol',
    status: 'pending',
    priority: 'high',
    description: '夜间校园安全巡逻',
    routeId: 'r1',
    routeName: '校园周界巡逻',
    creator: '系统',
    createdAt: formatDate(0) + 'T18:00:00Z',
    executor: '系统',
    repeat: 'daily'
  },
  {
    id: '9',
    name: '紧急搜救演练',
    type: 'rescue',
    status: 'cancelled',
    priority: 'urgent',
    description: '模拟紧急搜救演练任务',
    droneId: '6',
    droneName: '无人机-06',
    routeId: 'r7',
    routeName: '搜救航线',
    creator: '应急部门',
    createdAt: formatDate(5) + 'T09:00:00Z',
    executor: '应急部门',
    repeat: 'none'
  },
  {
    id: '10',
    name: '校园环境监测',
    type: 'custom',
    status: 'completed',
    priority: 'low',
    description: '空气质量与噪音监测',
    droneId: '7',
    droneName: '无人机-07',
    routeId: 'r8',
    routeName: '环境监测航线',
    creator: '环保部门',
    createdAt: formatDate(2) + 'T08:00:00Z',
    executor: '环保部门',
    repeat: 'weekly',
    startTime: formatDate(2) + 'T08:30:00Z',
    endTime: formatDate(2) + 'T10:00:00Z'
  },
  {
    id: '11',
    name: '停车场巡逻',
    type: 'patrol',
    status: 'completed',
    priority: 'normal',
    description: '停车场区域安全巡逻',
    droneId: '8',
    droneName: '无人机-08',
    routeId: 'r9',
    routeName: '停车场巡逻',
    creator: '安保部',
    createdAt: formatDate(4) + 'T07:00:00Z',
    executor: '安保部',
    repeat: 'daily',
    startTime: formatDate(4) + 'T07:30:00Z',
    endTime: formatDate(4) + 'T08:00:00Z'
  },
  {
    id: '12',
    name: '校门口交通疏导',
    type: 'support',
    status: 'running',
    priority: 'high',
    description: '上下高峰期校门口交通监控',
    droneId: '9',
    droneName: '无人机-09',
    routeId: 'r10',
    routeName: '校门口航线',
    creator: '交警部门',
    createdAt: formatDate(0) + 'T06:30:00Z',
    executor: '交警部门',
    repeat: 'daily',
    aiSettings: {
      realTimeAnalysis: true,
      autoAlert: true,
      notifyMethods: ['phone']
    },
    startTime: formatDate(0) + 'T07:00:00Z'
  },
  {
    id: '13',
    name: '新建宿舍巡检',
    type: 'inspection',
    status: 'pending',
    priority: 'normal',
    description: '新建宿舍楼施工安全检查',
    routeId: 'r11',
    routeName: '新建宿舍巡检',
    creator: '基建部',
    createdAt: formatDate(0) + 'T16:00:00Z',
    executor: '基建部',
    repeat: 'none'
  },
  {
    id: '14',
    name: '图书馆夜间巡逻',
    type: 'patrol',
    status: 'pending',
    priority: 'high',
    description: '图书馆夜间安全巡逻',
    routeId: 'r12',
    routeName: '图书馆巡逻',
    creator: '系统',
    createdAt: formatDate(0) + 'T20:00:00Z',
    executor: '系统',
    repeat: 'daily'
  },
  {
    id: '15',
    name: '考试期间监控',
    type: 'support',
    status: 'completed',
    priority: 'urgent',
    description: '考试期间校园空域监控',
    droneId: '1',
    droneName: '无人机-01',
    routeId: 'r13',
    routeName: '考试监控航线',
    creator: '教务处',
    createdAt: formatDate(7) + 'T08:00:00Z',
    executor: '教务处',
    repeat: 'none',
    startTime: formatDate(7) + 'T08:30:00Z',
    endTime: formatDate(7) + 'T17:00:00Z'
  }
]

export const mockScheduledTasks: ScheduledTask[] = [
  {
    id: 's1',
    taskId: '1',
    taskName: '日常校园巡逻',
    scheduleType: 'daily',
    time: '08:00',
    enabled: true
  },
  {
    id: 's2',
    taskId: '3',
    taskName: '宿舍楼巡检',
    scheduleType: 'weekly',
    time: '14:00',
    dayOfWeek: [1, 3, 5],
    enabled: true
  },
  {
    id: 's3',
    taskId: '6',
    taskName: '图书馆周边巡逻',
    scheduleType: 'daily',
    time: '07:00',
    enabled: true
  },
  {
    id: 's4',
    taskId: '8',
    taskName: '夜间校园巡逻',
    scheduleType: 'daily',
    time: '20:00',
    enabled: false
  },
  {
    id: 's5',
    taskId: '10',
    taskName: '校园环境监测',
    scheduleType: 'weekly',
    time: '08:00',
    dayOfWeek: [2],
    enabled: true
  },
  {
    id: 's6',
    taskId: '11',
    taskName: '停车场巡逻',
    scheduleType: 'daily',
    time: '07:00',
    enabled: true
  },
  {
    id: 's7',
    taskId: '12',
    taskName: '校门口交通疏导',
    scheduleType: 'daily',
    time: '07:00',
    enabled: true
  },
  {
    id: 's8',
    taskId: '14',
    taskName: '图书馆夜间巡逻',
    scheduleType: 'daily',
    time: '20:00',
    enabled: true
  }
]

export const mockTaskLogs: TaskLog[] = [
  {
    id: 'l1',
    taskId: '1',
    taskName: '日常校园巡逻',
    droneId: '1',
    droneName: '无人机-01',
    event: 'started',
    message: '任务开始执行',
    timestamp: formatDate(0) + 'T08:30:00Z'
  },
  {
    id: 'l2',
    taskId: '1',
    taskName: '日常校园巡逻',
    droneId: '1',
    droneName: '无人机-01',
    event: 'takeoff',
    message: '无人机已起飞',
    timestamp: formatDate(0) + 'T08:31:00Z'
  },
  {
    id: 'l3',
    taskId: '2',
    taskName: '教学楼巡检',
    droneId: '2',
    droneName: '无人机-02',
    event: 'started',
    message: '任务开始执行',
    timestamp: formatDate(1) + 'T10:00:00Z'
  },
  {
    id: 'l4',
    taskId: '2',
    taskName: '教学楼巡检',
    droneId: '2',
    droneName: '无人机-02',
    event: 'alert',
    message: '检测到异常人员',
    detail: '教学楼前发现可疑人员逗留',
    timestamp: formatDate(1) + 'T10:45:00Z'
  },
  {
    id: 'l5',
    taskId: '2',
    taskName: '教学楼巡检',
    droneId: '2',
    droneName: '无人机-02',
    event: 'completed',
    message: '任务执行完成',
    timestamp: formatDate(1) + 'T11:30:00Z'
  },
  {
    id: 'l6',
    taskId: '5',
    taskName: '实验楼安全检查',
    droneId: '3',
    droneName: '无人机-03',
    event: 'started',
    message: '任务开始执行',
    timestamp: formatDate(1) + 'T16:00:00Z'
  },
  {
    id: 'l7',
    taskId: '5',
    taskName: '实验楼安全检查',
    droneId: '3',
    droneName: '无人机-03',
    event: 'failed',
    message: '任务执行失败',
    detail: '电池电量过低，强制返航',
    timestamp: formatDate(1) + 'T16:30:00Z'
  },
  {
    id: 'l8',
    taskId: '7',
    taskName: '食堂配送任务',
    droneId: '5',
    droneName: '无人机-05',
    event: 'started',
    message: '任务开始执行',
    timestamp: formatDate(0) + 'T11:30:00Z'
  },
  {
    id: 'l9',
    taskId: '7',
    taskName: '食堂配送任务',
    droneId: '5',
    droneName: '无人机-05',
    event: 'takeoff',
    message: '无人机已起飞',
    timestamp: formatDate(0) + 'T11:31:00Z'
  },
  {
    id: 'l10',
    taskId: '7',
    taskName: '食堂配送任务',
    droneId: '5',
    droneName: '无人机-05',
    event: 'land',
    message: '无人机已降落',
    timestamp: formatDate(0) + 'T11:45:00Z'
  },
  {
    id: 'l11',
    taskId: '7',
    taskName: '食堂配送任务',
    droneId: '5',
    droneName: '无人机-05',
    event: 'completed',
    message: '任务执行完成',
    detail: '配送成功完成',
    timestamp: formatDate(0) + 'T11:46:00Z'
  },
  {
    id: 'l12',
    taskId: '12',
    taskName: '校门口交通疏导',
    droneId: '9',
    droneName: '无人机-09',
    event: 'started',
    message: '任务开始执行',
    timestamp: formatDate(0) + 'T07:00:00Z'
  },
  {
    id: 'l13',
    taskId: '12',
    taskName: '校门口交通疏导',
    droneId: '9',
    droneName: '无人机-09',
    event: 'alert',
    message: '检测到交通拥堵',
    detail: '校门口东侧出现拥堵',
    timestamp: formatDate(0) + 'T07:30:00Z'
  }
]

export const mockRoutes = [
  { id: 'r1', name: '校园周界巡逻' },
  { id: 'r2', name: '教学楼巡检' },
  { id: 'r3', name: '宿舍楼巡检' },
  { id: 'r4', name: '操场巡逻' },
  { id: 'r5', name: '实验楼巡检' },
  { id: 'r6', name: '配送航线' },
  { id: 'r7', name: '搜救航线' },
  { id: 'r8', name: '环境监测航线' },
  { id: 'r9', name: '停车场巡逻' },
  { id: 'r10', name: '校门口航线' },
  { id: 'r11', name: '新建宿舍巡检' },
  { id: 'r12', name: '图书馆巡逻' },
  { id: 'r13', name: '考试监控航线' }
]