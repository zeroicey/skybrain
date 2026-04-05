// Mock AI数据和API模拟
import type { AIMessage, CommandResult, ParsedTask, QuickReply, ApiResponse } from '@/types/ai'
import { mockDrones } from './mock-drones'
import { mockRoutes } from './mock-tasks'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// AI回复Mock数据
export const mockAIResponses: Record<string, string> = {
  '如何创建任务': `您可以通过以下方式创建巡逻任务：

1. 在任务管理页面点击"新建任务"
2. 选择"巡逻"任务类型
3. 选择巡逻航线和执行无人机
4. 设置执行时间后提交

或者直接对我说："创建日常巡逻任务"
5. 使用自然语言任务创建功能`,
  '查看无人机状态': '您可以在设备管理页面查看无人机的实时状态，包括电池电量、在线状态、当前位置等信息。',
  '如何添加航线': '在飞行管理模块中，您可以：\n1. 点击"航线管理"\n2. 选择"新建航线"\n3. 在地图上绘制航点\n4. 设置飞行参数后保存',
  'default': '您好！我是无人机系统AI助手。有什么可以帮助您的？\n\n您可以尝试以下问题：\n- 如何创建任务\n- 查看无人机状态\n- 如何添加航线'
}

// 快捷回复
export const mockQuickReplies: QuickReply[] = [
  { id: '1', label: '如何创建任务？', query: '如何创建任务' },
  { id: '2', label: '查看无人机状态', query: '查看无人机状态' },
  { id: '3', label: '如何添加航线？', query: '如何添加航线' },
  { id: '4', label: '系统有哪些功能？', query: '系统有哪些功能' },
]

// 语音指令示例
export const mockCommandExamples = [
  '让2号无人机去教学楼A巡逻',
  '查看无人机1的状态',
  '让3号无人机返航',
  '创建日常巡检任务',
  '查看所有无人机电量',
]

// 解析任务描述
function parseTaskDescription(text: string): ParsedTask {
  const result: ParsedTask = {
    confidence: 0.85,
  }

  // 解析无人机
  const droneMatch = text.match(/(\d+)号无人机/)
  if (droneMatch) {
    const droneId = droneMatch[1]
    result.droneId = droneId
    result.droneName = `${droneId}号无人机`
  }

  // 解析任务类型
  if (text.includes('巡检')) {
    result.taskType = 'inspection'
    result.taskTypeLabel = '巡检'
  } else if (text.includes('巡逻')) {
    result.taskType = 'patrol'
    result.taskTypeLabel = '巡逻'
  } else if (text.includes('物流') || text.includes('配送')) {
    result.taskType = 'logistics'
    result.taskTypeLabel = '物流'
  }

  // 解析时间
  const timeMatch = text.match(/(今天|明天|后天)?\s*(上午|下午|早上|晚上)?\s*(\d+)[点时]/)
  if (timeMatch) {
    const dateStr = timeMatch[1] || '今天'
    const periodStr = timeMatch[2] || ''
    const hourStr = timeMatch[3]
    result.executeTime = `${dateStr} ${periodStr} ${hourStr}:00`.replace(/\s+/g, ' ').trim()
  }

  // 解析地点
  const locationMatch = text.match(/(教学楼|宿舍|饭堂|校门|图书馆|操场)([A-Z])?/)
  if (locationMatch) {
    result.location = locationMatch[0]
    result.routeName = `${locationMatch[1]}巡检航线`
  }

  // 解析任务描述
  const descMatch = text.match(/进行(.+?)(?:任务|$)/)
  if (descMatch) {
    result.description = descMatch[1]
  }

  return result
}

// 聊天API
export async function chatWithAI(
  message: string
): Promise<ApiResponse<AIMessage>> {
  await delay(1000 + Math.random() * 1000)

  // 简单的关键词匹配
  let content = mockAIResponses.default
  for (const [key, value] of Object.entries(mockAIResponses)) {
    if (message.includes(key)) {
      content = value
      break
    }
  }

  return {
    success: true,
    data: {
      id: Date.now().toString(),
      role: 'ai',
      content,
      timestamp: new Date(),
    },
  }
}

// 语音指令处理
export async function processVoiceCommand(
  command: string
): Promise<ApiResponse<CommandResult>> {
  await delay(500)

  const result: CommandResult = {
    id: Date.now().toString(),
    command,
    success: true,
    message: '指令已理解，正在执行...',
    timestamp: new Date(),
  }

  // 模拟不同指令的处理
  if (command.includes('返航')) {
    result.message = '无人机已收到返航指令，正在返航...'
    result.data = { action: 'return', status: 'executing' }
  } else if (command.includes('巡逻') || command.includes('巡检')) {
    result.message = '任务已创建，无人机即将起飞执行任务'
    result.data = { action: 'task', status: 'created' }
  } else if (command.includes('状态')) {
    const droneMatch = command.match(/(\d+)号/)
    const drone = droneMatch ? mockDrones.find(d => d.id === droneMatch[1]) : mockDrones[0]
    result.message = `无人机${drone?.name || '1'}: ${drone?.status || '在线'}, 电池${drone?.battery || 85}%`
    result.data = { action: 'query', status: 'completed', drone }
  }

  return { success: true, data: result }
}

// 任务解析API
export async function parseTaskDescriptionAPI(
  description: string
): Promise<ApiResponse<ParsedTask>> {
  await delay(800)

  const parsed = parseTaskDescription(description)

  return {
    success: true,
    data: parsed,
  }
}

// 获取建议航线
export function getSuggestedRoutes(location?: string) {
  if (!location) return mockRoutes.slice(0, 3)
  return mockRoutes.filter(r => r.name.includes(location.replace(/\d+/, '')))
}