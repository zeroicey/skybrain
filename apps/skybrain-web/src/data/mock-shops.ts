// 商铺基础数据
export interface Shop {
  id: string
  name: string
  type: 'restaurant' | 'retail' | 'service'
  location: string
  capacity: number
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
  peakTime: string // 高峰时段
  hotShop: string // 最热门商铺
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

// 商铺列表
export const shops: Shop[] = [
  { id: 'shop-1', name: '奶茶店A', type: 'retail', location: '商业街A区', capacity: 30 },
  { id: 'shop-2', name: '快餐店B', type: 'restaurant', location: '商业街A区', capacity: 80 },
  { id: 'shop-3', name: '便利店C', type: 'retail', location: '商业街B区', capacity: 40 },
  { id: 'shop-4', name: '理发店D', type: 'service', location: '商业街B区', capacity: 15 },
  { id: 'shop-5', name: '水果店E', type: 'retail', location: '商业街C区', capacity: 25 },
  { id: 'shop-6', name: '咖啡厅F', type: 'retail', location: '商业街C区', capacity: 50 },
  { id: 'shop-7', name: '小吃店G', type: 'restaurant', location: '商业街A区', capacity: 40 },
  { id: 'shop-8', name: '药店H', type: 'retail', location: '商业街B区', capacity: 20 },
]

// 商业街区
export const shopDistricts = [
  { id: 'district-1', name: '商业街A区' },
  { id: 'district-2', name: '商业街B区' },
  { id: 'district-3', name: '商业街C区' },
]

// 商铺类型
export const shopTypes = [
  { id: 'all', name: '全部类型' },
  { id: 'restaurant', name: '餐饮' },
  { id: 'retail', name: '零售' },
  { id: 'service', name: '服务' },
]

// 摄像头列表
export const shopCameras = [
  { id: 'shop-cam-1', name: '商业街A区入口', shopId: 'shop-1' },
  { id: 'shop-cam-2', name: '商业街B区入口', shopId: 'shop-3' },
  { id: 'shop-cam-3', name: '商业街C区入口', shopId: 'shop-5' },
  { id: 'shop-cam-4', name: '商业街中心', shopId: 'shop-2' },
]

// 生成24小时客流量趋势数据 (每半小时一个点)
export function generateHourlyTrend(baseCount: number = 200): TimeSlotData[] {
  const slots: TimeSlotData[] = []
  const hours = Array.from({ length: 24 }, (_, i) => i)

  hours.forEach((hour) => {
    // 模拟商铺客流规律
    let multiplier = 0.2 // 基础值
    if (hour >= 7 && hour <= 9) multiplier = 0.6 + Math.random() * 0.3 // 早高峰
    if (hour >= 11 && hour <= 13) multiplier = 1.0 + Math.random() * 0.3 // 午间高峰
    if (hour >= 16 && hour <= 18) multiplier = 0.8 + Math.random() * 0.3 // 下午高峰
    if (hour >= 19 && hour <= 21) multiplier = 0.7 + Math.random() * 0.3 // 晚间

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
  const areas = shops.map((shop) => shop.name)

  return areas.map((name, index) => {
    // 奶茶店和快餐店人最多
    let baseDensity = 20 + Math.random() * 30
    if (index === 0 || index === 1) baseDensity = 60 + Math.random() * 40
    if (index >= 5) baseDensity = 30 + Math.random() * 30

    return {
      id: `shop-area-${index + 1}`,
      name,
      count: Math.round(baseDensity * 3),
      density: Math.round(baseDensity),
    }
  })
}

// 生成时段对比数据 (今日/昨日/上周)
export function generateComparisonData(): { labels: string[]; data: ComparisonData } {
  const labels = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

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
export function generateForecastData(baseCount: number = 200): ForecastData[] {
  const now = new Date()
  const forecasts: ForecastData[] = []

  for (let i = 0; i < 8; i++) {
    const forecastTime = new Date(now.getTime() + i * 15 * 60 * 1000)
    const hour = forecastTime.getHours()

    let trend = 1.0
    if (hour >= 11 && hour <= 13) trend = 1.2
    if (hour >= 14 && hour <= 16) trend = 0.6
    if (hour >= 19 && hour <= 21) trend = 1.1

    const predicted = Math.round(baseCount * trend * (0.9 + Math.random() * 0.2))
    const confidence = 90 - i * 5

    forecasts.push({
      time: `${hour.toString().padStart(2, '0')}:${forecastTime.getMinutes().toString().padStart(2, '0')}`,
      predicted,
      confidence,
    })
  }

  return forecasts
}

// 客流来源分布
export function generateSourceDistribution() {
  return [
    { name: '学生', value: 45, color: '#3b82f6' },
    { name: '教职工', value: 25, color: '#8b5cf6' },
    { name: '周边居民', value: 20, color: '#f59e0b' },
    { name: '外来访客', value: 10, color: '#10b981' },
  ]
}

// 业态分布
export function generateTypeDistribution() {
  return [
    { name: '零售', value: 40, color: '#3b82f6' },
    { name: '餐饮', value: 35, color: '#f59e0b' },
    { name: '服务', value: 25, color: '#10b981' },
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

  let baseCount = 50
  if (hour >= 7 && hour <= 9) baseCount = 150
  if (hour >= 11 && hour <= 13) baseCount = 300
  if (hour >= 16 && hour <= 18) baseCount = 250
  if (hour >= 19 && hour <= 21) baseCount = 200

  const realtimeCount = Math.round(baseCount * (0.8 + Math.random() * 0.4))
  const todayTotal = Math.round(realtimeCount * 10 * (0.5 + Math.random() * 0.5))

  const capacity = 400
  const congestionIndex = calculateCongestionIndex(realtimeCount, capacity)
  const congestionLevel = getCongestionLevel(congestionIndex)

  return {
    realtimeCount,
    todayTotal,
    congestionLevel,
    peakTime: '12:00',
    hotShop: '奶茶店A',
  }
}

// 实时人数变化 (用于定时更新)
export function updateRealtimeCount(currentCount: number, capacity: number): number {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  let changeRange = 15

  if (minute < 5 || minute > 55) {
    changeRange = 30
  }

  if ((hour >= 11 && hour <= 13) || (hour >= 17 && hour <= 19)) {
    changeRange = 25
  }

  const change = Math.round((Math.random() - 0.5) * changeRange * 2)
  let newCount = currentCount + change

  const maxCount = Math.round(capacity * 1.2)
  newCount = Math.max(20, Math.min(maxCount, newCount))

  return newCount
}

// 生成视频流 URL (模拟)
export function getStreamUrl(cameraId: string): string {
  const sampleVideos = [
    '/videos/shop1.mp4',
    '/videos/shop2.mp4',
    '/videos/campus1.mp4',
  ]
  return sampleVideos[Math.abs(cameraId.charCodeAt(0)) % sampleVideos.length]
}