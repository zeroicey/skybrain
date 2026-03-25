// 宿舍基础数据
export interface Dormitory {
  id: string
  name: string
  building: string
  floors: number
  capacity: number
  gender: 'male' | 'female' | 'mixed'
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
  realtimeCount: number
  todayTotal: number
  congestionLevel: 'light' | 'medium' | 'heavy'
  peakTime: string
  returnRate: number
}

// 预测数据
export interface ForecastData {
  time: string
  predicted: number
  confidence: number
}

export const dormitories: Dormitory[] = [
  { id: 'dorm-1', name: '1号楼', building: '东区宿舍', floors: 6, capacity: 400, gender: 'male' },
  { id: 'dorm-2', name: '2号楼', building: '东区宿舍', floors: 6, capacity: 400, gender: 'male' },
  { id: 'dorm-3', name: '3号楼', building: '西区宿舍', floors: 6, capacity: 350, gender: 'female' },
  { id: 'dorm-4', name: '4号楼', building: '西区宿舍', floors: 6, capacity: 350, gender: 'female' },
  { id: 'dorm-5', name: '5号楼', building: '南区宿舍', floors: 8, capacity: 500, gender: 'mixed' },
  { id: 'dorm-6', name: '6号楼', building: '南区宿舍', floors: 8, capacity: 500, gender: 'mixed' },
]

export const dormitoryCameras = [
  { id: 'dorm-cam-1', name: '东门入口', dormitoryId: 'dorm-1' },
  { id: 'dorm-cam-2', name: '西门入口', dormitoryId: 'dorm-3' },
  { id: 'dorm-cam-3', name: '南门入口', dormitoryId: 'dorm-5' },
]

export function generateHourlyTrend(baseCount: number = 200): TimeSlotData[] {
  const slots: TimeSlotData[] = []
  const hours = Array.from({ length: 24 }, (_, i) => i)

  hours.forEach((hour) => {
    let multiplier = 0.3
    if (hour >= 6 && hour <= 8) multiplier = 0.8 + Math.random() * 0.4
    if (hour >= 11 && hour <= 13) multiplier = 0.5 + Math.random() * 0.2
    if (hour >= 17 && hour <= 19) multiplier = 1.0 + Math.random() * 0.3
    if (hour >= 20 && hour <= 23) multiplier = 1.2 + Math.random() * 0.3
    if (hour >= 0 && hour <= 5) multiplier = 0.1 + Math.random() * 0.1

    const count = Math.round(baseCount * multiplier * (0.8 + Math.random() * 0.4))
    const isPeak = hour >= 20 && hour <= 23

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
  const floors = ['1层', '2层', '3层', '4层', '5层', '6层']
  return floors.map((name, index) => ({
    id: `floor-${index + 1}`,
    name,
    count: Math.round(50 + Math.random() * 100),
    density: Math.round(20 + Math.random() * 60),
  }))
}

export function generateForecastData(baseCount: number = 500): ForecastData[] {
  const now = new Date()
  const forecasts: ForecastData[] = []
  for (let i = 0; i < 8; i++) {
    const forecastTime = new Date(now.getTime() + i * 15 * 60 * 1000)
    forecasts.push({
      time: `${forecastTime.getHours().toString().padStart(2, '0')}:${forecastTime.getMinutes().toString().padStart(2, '0')}`,
      predicted: Math.round(baseCount * (0.8 + Math.random() * 0.4)),
      confidence: 90 - i * 5,
    })
  }
  return forecasts
}

export function generateGenderDistribution() {
  return [
    { name: '男生', value: 45, color: '#3b82f6' },
    { name: '女生', value: 40, color: '#ec4899' },
    { name: '访客', value: 15, color: '#f59e0b' },
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

  let baseCount = 300
  if (hour >= 0 && hour <= 6) baseCount = 450
  if (hour >= 7 && hour <= 9) baseCount = 150
  if (hour >= 10 && hour <= 14) baseCount = 100
  if (hour >= 15 && hour <= 18) baseCount = 80
  if (hour >= 19 && hour <= 23) baseCount = 500

  const realtimeCount = Math.round(baseCount * (0.9 + Math.random() * 0.2))
  const todayTotal = Math.round(realtimeCount * 15 * (0.8 + Math.random() * 0.4))
  const capacity = 600
  const congestionIndex = calculateCongestionIndex(realtimeCount, capacity)
  const congestionLevel = getCongestionLevel(congestionIndex)

  return {
    realtimeCount,
    todayTotal,
    congestionLevel,
    peakTime: '22:00',
    returnRate: 85 + Math.round(Math.random() * 10)
  }
}

export function updateRealtimeCount(currentCount: number, capacity: number): number {
  const change = Math.round((Math.random() - 0.5) * 20)
  let newCount = currentCount + change
  const maxCount = Math.round(capacity * 1.1)
  newCount = Math.max(100, Math.min(maxCount, newCount))
  return newCount
}