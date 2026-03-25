// 校门基础数据
export interface Gate {
  id: string
  name: string
  location: string
  capacity: number
}

// 区域数据
export interface AreaData {
  id: string
  name: string
  count: number
  density: number
}

// 时段数据
export interface TimeSlotData {
  time: string
  count: number
  isPeak: boolean
}

// 统计卡片数据
export interface StatCardData {
  realtimeIn: number
  realtimeOut: number
  todayTotal: number
  congestionLevel: 'light' | 'medium' | 'heavy'
  peakTime: string
  anomalyCount: number
}

// 预测数据
export interface ForecastData {
  time: string
  predicted: number
  confidence: number
}

// 身份类型
export type IdentityType = 'student' | 'teacher' | 'visitor'

// 进出方向
export type Direction = 'in' | 'out'

export const gates: Gate[] = [
  { id: 'gate-1', name: '东门', location: '东校区', capacity: 500 },
  { id: 'gate-2', name: '西门', location: '西校区', capacity: 500 },
  { id: 'gate-3', name: '南门', location: '南校区', capacity: 300 },
  { id: 'gate-4', name: '北门', location: '北校区', capacity: 300 },
]

export const gateCameras = [
  { id: 'gate-cam-1', name: '东门通道1', gateId: 'gate-1' },
  { id: 'gate-cam-2', name: '东门通道2', gateId: 'gate-1' },
  { id: 'gate-cam-3', name: '西门通道1', gateId: 'gate-2' },
  { id: 'gate-cam-4', name: '南门通道1', gateId: 'gate-3' },
  { id: 'gate-cam-5', name: '北门通道1', gateId: 'gate-4' },
]

export function generateHourlyTrend(baseCount: number = 200): TimeSlotData[] {
  const slots: TimeSlotData[] = []
  const hours = Array.from({ length: 24 }, (_, i) => i)

  hours.forEach((hour) => {
    let multiplier = 0.2
    if (hour >= 6 && hour <= 8) multiplier = 1.2 + Math.random() * 0.3
    if (hour >= 9 && hour <= 11) multiplier = 0.4 + Math.random() * 0.2
    if (hour >= 12 && hour <= 13) multiplier = 0.5 + Math.random() * 0.2
    if (hour >= 17 && hour <= 19) multiplier = 1.0 + Math.random() * 0.3

    const count = Math.round(baseCount * multiplier * (0.8 + Math.random() * 0.4))
    const isPeak = hour >= 6 && hour <= 8

    ;['00', '30'].forEach((minute) => {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:${minute}`,
        count,
        isPeak,
      })
    })
  })

  return slots
}

export function generateAreaHeatmapData(): AreaData[] {
  const timeSlots = ['早高峰(6-8)', '上午(9-11)', '午间(12-13)', '下午(14-16)', '晚高峰(17-19)', '夜间(20-22)']
  return timeSlots.map((name, index) => ({
    id: `time-${index + 1}`,
    name,
    count: Math.round(200 + Math.random() * 500),
    density: index === 0 || index === 4 ? 80 + Math.random() * 20 : 30 + Math.random() * 30,
  }))
}

export function generateForecastData(baseCount: number = 200): ForecastData[] {
  const now = new Date()
  const forecasts: ForecastData[] = []
  for (let i = 0; i < 8; i++) {
    const forecastTime = new Date(now.getTime() + i * 15 * 60 * 1000)
    const hour = forecastTime.getHours()
    let trend = 1.0
    if (hour >= 6 && hour <= 8) trend = 1.3
    if (hour >= 17 && hour <= 19) trend = 1.2
    forecasts.push({
      time: `${forecastTime.getHours().toString().padStart(2, '0')}:${forecastTime.getMinutes().toString().padStart(2, '0')}`,
      predicted: Math.round(baseCount * trend * (0.8 + Math.random() * 0.4)),
      confidence: 90 - i * 5,
    })
  }
  return forecasts
}

export function generateIdentityDistribution() {
  return [
    { name: '学生', value: 70, color: '#3b82f6' },
    { name: '教职工', value: 20, color: '#8b5cf6' },
    { name: '外来人员', value: 10, color: '#f59e0b' },
  ]
}

export function generateDirectionDistribution(inCount: number, outCount: number) {
  const total = inCount + outCount
  return [
    { name: '进入', value: Math.round((inCount / total) * 100), color: '#10b981' },
    { name: '离开', value: Math.round((outCount / total) * 100), color: '#ef4444' },
  ]
}

export function calculateCongestionIndex(currentCount: number, capacity: number): number {
  const ratio = currentCount / capacity
  return Math.min(100, Math.round(ratio * 100))
}

export function getCongestionLevel(index: number): 'light' | 'medium' | 'heavy' {
  if (index < 40) return 'light'
  if (index < 70) return 'medium'
  return 'heavy'
}

export function generateStatCardData(): StatCardData {
  const now = new Date()
  const hour = now.getHours()

  let baseCount = 100
  if (hour >= 6 && hour <= 8) baseCount = 400
  if (hour >= 9 && hour <= 11) baseCount = 150
  if (hour >= 12 && hour <= 13) baseCount = 200
  if (hour >= 17 && hour <= 19) baseCount = 350
  if (hour >= 20 && hour <= 22) baseCount = 100

  const realtimeIn = Math.round(baseCount * (0.8 + Math.random() * 0.4))
  const realtimeOut = Math.round(baseCount * (0.7 + Math.random() * 0.4))
  const todayTotal = Math.round((realtimeIn + realtimeOut) * 10 * (0.5 + Math.random() * 0.5))
  const capacity = 500
  const congestionIndex = calculateCongestionIndex(realtimeIn + realtimeOut, capacity)
  const congestionLevel = getCongestionLevel(congestionIndex)

  return {
    realtimeIn,
    realtimeOut,
    todayTotal,
    congestionLevel,
    peakTime: '07:30',
    anomalyCount: Math.round(Math.random() * 5),
  }
}

export function updateRealtimeCount(currentIn: number, currentOut: number, capacity: number): { in: number; out: number } {
  const changeIn = Math.round((Math.random() - 0.5) * 20)
  const changeOut = Math.round((Math.random() - 0.5) * 20)
  let newIn = Math.max(10, Math.min(capacity, currentIn + changeIn))
  let newOut = Math.max(10, Math.min(capacity, currentOut + changeOut))
  return { in: newIn, out: newOut }
}