// 教学楼基础数据
export interface Building {
  id: string
  name: string
  floors: number
  classrooms: number
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
  realtimeCount: number
  todayTotal: number
  congestionLevel: 'light' | 'medium' | 'heavy'
  peakTime: string
  classroomUsage: number
}

// 预测数据
export interface ForecastData {
  time: string
  predicted: number
  confidence: number
}

export const buildings: Building[] = [
  { id: 'build-1', name: '教学楼A', floors: 5, classrooms: 30, capacity: 1500 },
  { id: 'build-2', name: '教学楼B', floors: 4, classrooms: 24, capacity: 1200 },
  { id: 'build-3', name: '教学楼C', floors: 6, classrooms: 36, capacity: 1800 },
  { id: 'build-4', name: '教学楼D', floors: 5, classrooms: 28, capacity: 1400 },
]

export const buildingCameras = [
  { id: 'build-cam-1', name: '教学楼A正门', buildingId: 'build-1' },
  { id: 'build-cam-2', name: '教学楼B正门', buildingId: 'build-2' },
  { id: 'build-cam-3', name: '教学楼C正门', buildingId: 'build-3' },
]

export function generateHourlyTrend(baseCount: number = 200): TimeSlotData[] {
  const slots: TimeSlotData[] = []
  const hours = Array.from({ length: 24 }, (_, i) => i)

  hours.forEach((hour) => {
    let multiplier = 0.1
    if (hour >= 7 && hour <= 8) multiplier = 0.6 + Math.random() * 0.3
    if (hour >= 9 && hour <= 11) multiplier = 1.0 + Math.random() * 0.3
    if (hour >= 12 && hour <= 13) multiplier = 0.4 + Math.random() * 0.2
    if (hour >= 14 && hour <= 16) multiplier = 0.9 + Math.random() * 0.3
    if (hour >= 17 && hour <= 18) multiplier = 0.5 + Math.random() * 0.2
    if (hour >= 19 && hour <= 21) multiplier = 0.3 + Math.random() * 0.2

    const count = Math.round(baseCount * multiplier * (0.8 + Math.random() * 0.4))
    const isPeak = hour >= 9 && hour <= 11

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
  const areas = ['一楼大厅', '二楼走廊', '三楼教室区', '四楼教室区', '五楼教室区', '休息区']
  return areas.map((name, index) => ({
    id: `area-${index + 1}`,
    name,
    count: Math.round(50 + Math.random() * 200),
    density: Math.round(20 + Math.random() * 70),
  }))
}

export function generateForecastData(baseCount: number = 500): ForecastData[] {
  const now = new Date()
  const forecasts: ForecastData[] = []
  for (let i = 0; i < 8; i++) {
    const forecastTime = new Date(now.getTime() + i * 15 * 60 * 1000)
    forecasts.push({
      time: `${forecastTime.getHours().toString().padStart(2, '0')}:${forecastTime.getMinutes().toString().padStart(2, '0')}`,
      predicted: Math.round(baseCount * (0.7 + Math.random() * 0.5)),
      confidence: 90 - i * 5,
    })
  }
  return forecasts
}

export function generateAreaDistribution() {
  return [
    { name: '教室', value: 60, color: '#3b82f6' },
    { name: '走廊', value: 20, color: '#8b5cf6' },
    { name: '厕所', value: 10, color: '#f59e0b' },
    { name: '休息区', value: 10, color: '#10b981' },
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

  let baseCount = 200
  if (hour >= 7 && hour <= 8) baseCount = 800
  if (hour >= 9 && hour <= 11) baseCount = 1200
  if (hour >= 12 && hour <= 13) baseCount = 400
  if (hour >= 14 && hour <= 16) baseCount = 1000
  if (hour >= 17 && hour <= 21) baseCount = 300

  const realtimeCount = Math.round(baseCount * (0.8 + Math.random() * 0.4))
  const todayTotal = Math.round(realtimeCount * 12 * (0.5 + Math.random() * 0.5))
  const capacity = 1500
  const congestionIndex = calculateCongestionIndex(realtimeCount, capacity)
  const congestionLevel = getCongestionLevel(congestionIndex)

  return {
    realtimeCount,
    todayTotal,
    congestionLevel,
    peakTime: '10:00',
    classroomUsage: 65 + Math.round(Math.random() * 30)
  }
}

export function updateRealtimeCount(currentCount: number, capacity: number): number {
  const change = Math.round((Math.random() - 0.5) * 30)
  let newCount = currentCount + change
  const maxCount = Math.round(capacity * 1.2)
  newCount = Math.max(50, Math.min(maxCount, newCount))
  return newCount
}