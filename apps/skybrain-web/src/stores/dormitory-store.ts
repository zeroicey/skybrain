import { create } from 'zustand'
import {
  type Dormitory,
  type AreaData,
  type TimeSlotData,
  type StatCardData,
  type ForecastData,
  dormitories,
  generateHourlyTrend,
  generateAreaHeatmapData,
  generateForecastData,
  generateStatCardData,
  updateRealtimeCount,
  calculateCongestionIndex,
  getCongestionLevel,
} from '@/data/mock-dormitories'

interface DormitoryStore {
  selectedDormitoryId: string
  selectedDormitory: Dormitory | null
  selectedDate: string

  realtimeCount: number
  statCardData: StatCardData
  hourlyTrend: TimeSlotData[]
  areaHeatmap: AreaData[]
  forecastData: ForecastData[]
  congestionIndex: number
  streamUrl: string

  setSelectedDormitory: (id: string) => void
  setSelectedDate: (date: string) => void
  updateRealtimeData: () => void
  refreshAllData: () => void
  setStreamUrl: (url: string) => void
}

export const useDormitoryStore = create<DormitoryStore>((set, get) => {
  const initialDormitoryId = 'dorm-1'
  const initialDormitory = dormitories.find((d) => d.id === initialDormitoryId) || dormitories[0]
  const initialStatCard = generateStatCardData()

  return {
    selectedDormitoryId: initialDormitoryId,
    selectedDormitory: initialDormitory,
    selectedDate: new Date().toISOString().split('T')[0],
    realtimeCount: initialStatCard.realtimeCount,
    statCardData: initialStatCard,
    hourlyTrend: generateHourlyTrend(initialDormitory.capacity / 2),
    areaHeatmap: generateAreaHeatmapData(),
    forecastData: generateForecastData(initialStatCard.realtimeCount),
    congestionIndex: calculateCongestionIndex(initialStatCard.realtimeCount, initialDormitory.capacity),
    streamUrl: '/videos/dorm1.mp4',

    setSelectedDormitory: (id) => {
      const dormitory = dormitories.find((d) => d.id === id)
      if (!dormitory) return
      set({ selectedDormitoryId: id, selectedDormitory: dormitory })
      get().refreshAllData()
    },

    setSelectedDate: (date) => {
      set({ selectedDate: date })
    },

    updateRealtimeData: () => {
      const { realtimeCount, selectedDormitory } = get()
      if (!selectedDormitory) return

      const newCount = updateRealtimeCount(realtimeCount, selectedDormitory.capacity)
      const newCongestionIndex = calculateCongestionIndex(newCount, selectedDormitory.capacity)
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

    refreshAllData: () => {
      const { selectedDormitory } = get()
      if (!selectedDormitory) return

      const statCard = generateStatCardData()

      set({
        statCardData: statCard,
        realtimeCount: statCard.realtimeCount,
        hourlyTrend: generateHourlyTrend(selectedDormitory.capacity / 2),
        areaHeatmap: generateAreaHeatmapData(),
        forecastData: generateForecastData(statCard.realtimeCount),
        congestionIndex: calculateCongestionIndex(statCard.realtimeCount, selectedDormitory.capacity),
      })
    },

    setStreamUrl: (url) => {
      set({ streamUrl: url })
    },
  }
})