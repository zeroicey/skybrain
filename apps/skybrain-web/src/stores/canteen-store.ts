import { create } from 'zustand'
import {
  type Canteen,
  type AreaData,
  type TimeSlotData,
  type StatCardData,
  type ComparisonData,
  type ForecastData,
  canteens,
  generateHourlyTrend,
  generateAreaHeatmapData,
  generateComparisonData,
  generateForecastData,
  generateStatCardData,
  updateRealtimeCount,
  calculateCongestionIndex,
  getCongestionLevel,
} from '@/data/mock-canteens'

interface CanteenStore {
  // 选中的饭堂
  selectedCanteenId: string
  selectedCanteen: Canteen | null

  // 选中的日期
  selectedDate: string

  // 实时人数
  realtimeCount: number

  // 统计卡片数据
  statCardData: StatCardData

  // 24小时趋势数据
  hourlyTrend: TimeSlotData[]

  // 区域热力数据
  areaHeatmap: AreaData[]

  // 时段对比数据
  comparisonData: ComparisonData | null

  // 预测数据
  forecastData: ForecastData[]

  // 拥堵指数
  congestionIndex: number

  // 视频流 URL
  streamUrl: string

  // Actions
  setSelectedCanteen: (id: string) => void
  setSelectedDate: (date: string) => void
  updateRealtimeData: () => void
  refreshAllData: () => void
  setStreamUrl: (url: string) => void
}

export const useCanteenStore = create<CanteenStore>((set, get) => {
  // 初始数据
  const initialCanteenId = 'canteen-1'
  const initialCanteen = canteens.find((c) => c.id === initialCanteenId) || canteens[0]
  const initialStatCard = generateStatCardData()

  return {
    // 初始状态
    selectedCanteenId: initialCanteenId,
    selectedCanteen: initialCanteen,
    selectedDate: new Date().toISOString().split('T')[0],
    realtimeCount: initialStatCard.realtimeCount,
    statCardData: initialStatCard,
    hourlyTrend: generateHourlyTrend(initialCanteen.capacity / 2),
    areaHeatmap: generateAreaHeatmapData(),
    comparisonData: null,
    forecastData: generateForecastData(initialStatCard.realtimeCount),
    congestionIndex: calculateCongestionIndex(initialStatCard.realtimeCount, initialCanteen.capacity),
    streamUrl: '/videos/canteen1.mp4',

    // 设置选中的饭堂
    setSelectedCanteen: (id) => {
      const canteen = canteens.find((c) => c.id === id)
      if (!canteen) return

      set({
        selectedCanteenId: id,
        selectedCanteen: canteen,
        streamUrl: `/videos/canteen${canteens.indexOf(canteen) + 1}.mp4`,
      })

      // 刷新数据
      get().refreshAllData()
    },

    // 设置选中的日期
    setSelectedDate: (date) => {
      set({ selectedDate: date })
      // TODO: 根据日期加载历史数据
    },

    // 更新实时数据 (每3秒调用一次)
    updateRealtimeData: () => {
      const { realtimeCount, selectedCanteen } = get()
      if (!selectedCanteen) return

      const newCount = updateRealtimeCount(realtimeCount, selectedCanteen.capacity)
      const newCongestionIndex = calculateCongestionIndex(newCount, selectedCanteen.capacity)
      const newCongestionLevel = getCongestionLevel(newCongestionIndex)

      set((state) => ({
        realtimeCount: newCount,
        congestionIndex: newCongestionIndex,
        statCardData: {
          ...state.statCardData,
          realtimeCount: newCount,
          congestionLevel: newCongestionLevel,
        },
      }))
    },

    // 刷新所有数据
    refreshAllData: () => {
      const { selectedCanteen } = get()
      if (!selectedCanteen) return

      const statCard = generateStatCardData()

      set({
        statCardData: statCard,
        realtimeCount: statCard.realtimeCount,
        hourlyTrend: generateHourlyTrend(selectedCanteen.capacity / 2),
        areaHeatmap: generateAreaHeatmapData(),
        comparisonData: generateComparisonData().data,
        forecastData: generateForecastData(statCard.realtimeCount),
        congestionIndex: calculateCongestionIndex(statCard.realtimeCount, selectedCanteen.capacity),
      })
    },

    // 设置视频流
    setStreamUrl: (url) => {
      set({ streamUrl: url })
    },
  }
})