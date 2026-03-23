// 饭堂基础数据
export interface Canteen {
  id: string
  name: string
  capacity: number // 可容纳人数
  location: string
}

// 区域数据
export interface AreaData {
  id: string
  name: string
  count: number
  density: number // 0-100 密度
}

// 时段数据
export interface TimeSlotData {
  time: string // HH:MM
  count: number
  isPeak: boolean // 是否高峰
}

// 统计卡片数据
export interface StatCardData {
  realtimeCount: number
  todayTotal: number
  congestionLevel: 'light' | 'medium' | 'heavy'
  peakMorning: string
  peakLunch: string
}

// 历史对比数据
export interface ComparisonData {
  today: number[]
  yesterday: number[]
  lastWeek: number[]
}

// 预测数据
export interface ForecastData {
  time: string
  predicted: number
  confidence: number // 置信度 0-100
}

// 饭堂列表
export const canteens: Canteen[] = [
  { id: 'canteen-1', name: '第一饭堂', capacity: 800, location: '校园中心区' },
  { id: 'canteen-2', name: '第二饭堂', capacity: 600, location: '东校区' },
  { id: 'canteen-3', name: '第三饭堂', capacity: 500, location: '西校区' },
  { id: 'canteen-4', name: '教师餐厅', capacity: 200, location: '行政楼' },
]

// 摄像头列表
export const cameras = [
  { id: 'cam-1', name: '一楼入口', canteenId: 'canteen-1' },
  { id: 'cam-2', name: '二楼就餐区', canteenId: 'canteen-1' },
  { id: 'cam-3', name: '一楼入口', canteenId: 'canteen-2' },
  { id: 'cam-4', name: '就餐区', canteenId: 'canteen-2' },
  { id: 'cam-5', name: '一楼入口', canteenId: 'canteen-3' },
  { id: 'cam-6', name: '大厅', canteenId: 'canteen-4' },
]

// 生成24小时人数趋势数据 (每半小时一个点)
export function generateHourlyTrend(baseCount: number = 200): TimeSlotData[] {
  const slots: TimeSlotData[] = []
  const hours = Array.from({ length: 24 }, (_, i) => i)

  hours.forEach((hour) => {
    // 模拟饭堂人流规律
    let multiplier = 0.3 // 基础值
    if (hour >= 6 && hour <= 8) multiplier = 0.8 + Math.random() * 0.4 // 早餐
    if (hour >= 11 && hour <= 13) multiplier = 1.2 + Math.random() * 0.3 // 午餐高峰
    if (hour >= 17 && hour <= 19) multiplier = 1.0 + Math.random() * 0.3 // 晚餐
    if (hour >= 20 && hour <= 21) multiplier = 0.4 + Math.random() * 0.2 // 夜宵

    const count = Math.round(baseCount * multiplier * (0.8 + Math.random() * 0.4))
    const isPeak = hour >= 11 && hour <= 13

    // 每小时2个数据点 (00 和 30 分)
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

// 生成区域热力数据
export function generateAreaHeatmapData(): AreaData[] {
  const areas = [
    '入口处',
    '打饭区',
    '面食区',
    '川菜区',
    '粤菜区',
    '清真区',
    '饮料区',
    '用餐区A',
    '用餐区B',
    '用餐区C',
  ]

  return areas.map((name, index) => {
    // 入口和打饭区人最多
    let baseDensity = 20 + Math.random() * 30
    if (index === 0 || index === 1) baseDensity = 60 + Math.random() * 40
    if (index >= 7) baseDensity = 30 + Math.random() * 30

    return {
      id: `area-${index + 1}`,
      name,
      count: Math.round(baseDensity * 8),
      density: Math.round(baseDensity),
    }
  })
}

// 生成时段对比数据 (今日/昨日/上周)
export function generateComparisonData(): { labels: string[]; data: ComparisonData } {
  const labels = ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

  const generateDayData = (base: number, variance: number) =>
    labels.map(() => Math.round(base * (0.5 + Math.random() * variance)))

  return {
    labels,
    data: {
      today: generateDayData(1.0, 0.4),
      yesterday: generateDayData(0.95, 0.4),
      lastWeek: generateDayData(0.85, 0.3),
    },
  }
}

// 生成预测数据 (未来2小时)
export function generateForecastData(baseCount: number = 500): ForecastData[] {
  const now = new Date()
  const forecasts: ForecastData[] = []

  for (let i = 0; i < 8; i++) {
    // 每15分钟一个预测点
    const forecastTime = new Date(now.getTime() + i * 15 * 60 * 1000)
    const hour = forecastTime.getHours()

    let trend = 1.0
    if (hour >= 11 && hour <= 13) trend = 1.2 // 午餐前上升
    if (hour >= 14 && hour <= 16) trend = 0.6 // 下午低谷

    const predicted = Math.round(baseCount * trend * (0.9 + Math.random() * 0.2))
    const confidence = 90 - i * 5 // 越远越低

    forecasts.push({
      time: `${hour.toString().padStart(2, '0')}:${forecastTime.getMinutes().toString().padStart(2, '0')}`,
      predicted,
      confidence,
    })
  }

  return forecasts
}

// 用餐区域分布
export function generateAreaDistribution() {
  return [
    { name: '一楼大厅', value: 35, color: '#3b82f6' },
    { name: '二楼餐厅', value: 28, color: '#8b5cf6' },
    { name: '风味小吃', value: 20, color: '#f59e0b' },
    { name: '清真餐厅', value: 10, color: '#10b981' },
    { name: '教师餐厅', value: 7, color: '#ec4899' },
  ]
}

// 计算拥堵指数
export function calculateCongestionIndex(currentCount: number, capacity: number): number {
  const ratio = currentCount / capacity
  return Math.min(100, Math.round(ratio * 100))
}

// 获取拥堵等级
export function getCongestionLevel(index: number): 'light' | 'medium' | 'heavy' {
  if (index < 40) return 'light'
  if (index < 70) return 'medium'
  return 'heavy'
}

// 生成统计卡片数据
export function generateStatCardData(): StatCardData {
  const now = new Date()
  const hour = now.getHours()

  // 根据时间计算当前人数
  let baseCount = 200
  if (hour >= 7 && hour <= 9) baseCount = 400
  if (hour >= 11 && hour <= 13) baseCount = 800
  if (hour >= 17 && hour <= 19) baseCount = 600
  if (hour >= 20 && hour <= 21) baseCount = 300

  const realtimeCount = Math.round(baseCount * (0.8 + Math.random() * 0.4))
  const todayTotal = Math.round(realtimeCount * 8 * (0.5 + Math.random() * 0.5)) // 估算今日累计

  const capacity = 800
  const congestionIndex = calculateCongestionIndex(realtimeCount, capacity)
  const congestionLevel = getCongestionLevel(congestionIndex)

  return {
    realtimeCount,
    todayTotal,
    congestionLevel,
    peakMorning: '07:30',
    peakLunch: '12:15',
  }
}

// 实时人数变化 (用于定时更新)
export function updateRealtimeCount(currentCount: number, capacity: number): number {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  // 基础变化范围
  let changeRange = 20

  // 整点前后变化较大
  if (minute < 5 || minute > 55) {
    changeRange = 50
  }

  // 午餐晚餐高峰
  if ((hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 19)) {
    changeRange = 40
  }

  const change = Math.round((Math.random() - 0.5) * changeRange * 2)
  let newCount = currentCount + change

  // 保持在合理范围
  const maxCount = Math.round(capacity * 1.2)
  newCount = Math.max(50, Math.min(maxCount, newCount))

  return newCount
}

// 生成视频流 URL (模拟)
export function getStreamUrl(cameraId: string): string {
  // 这里使用示例视频，实际应该是真实的视频流
  const sampleVideos = [
    '/videos/canteen1.mp4',
    '/videos/canteen2.mp4',
    '/videos/campus1.mp4',
  ]
  return sampleVideos[Math.abs(cameraId.charCodeAt(0)) % sampleVideos.length]
}