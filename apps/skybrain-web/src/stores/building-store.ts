import { create } from 'zustand'
import {
  type Building,
  type AreaData,
  type TimeSlotData,
  type StatCardData,
  type ForecastData,
  buildings,
  generateHourlyTrend,
  generateAreaHeatmapData,
  generateForecastData,
  generateStatCardData,
  updateRealtimeCount,
  calculateCongestionIndex,
  getCongestionLevel,
} from '@/data/mock-buildings'

interface BuildingStore {
  selectedBuildingId: string
  selectedBuilding: Building | null
  selectedDate: string

  realtimeCount: number
  statCardData: StatCardData
  hourlyTrend: TimeSlotData[]
  areaHeatmap: AreaData[]
  forecastData: ForecastData[]
  congestionIndex: number
  streamUrl: string

  setSelectedBuilding: (id: string) => void
  setSelectedDate: (date: string) => void
  updateRealtimeData: () => void
  refreshAllData: () => void
  setStreamUrl: (url: string) => void
}

export const useBuildingStore = create<BuildingStore>((set, get) => {
  const initialBuildingId = 'build-1'
  const initialBuilding = buildings.find((b) => b.id === initialBuildingId) || buildings[0]
  const initialStatCard = generateStatCardData()

  return {
    selectedBuildingId: initialBuildingId,
    selectedBuilding: initialBuilding,
    selectedDate: new Date().toISOString().split('T')[0],
    realtimeCount: initialStatCard.realtimeCount,
    statCardData: initialStatCard,
    hourlyTrend: generateHourlyTrend(initialBuilding.capacity / 4),
    areaHeatmap: generateAreaHeatmapData(),
    forecastData: generateForecastData(initialStatCard.realtimeCount),
    congestionIndex: calculateCongestionIndex(initialStatCard.realtimeCount, initialBuilding.capacity),
    streamUrl: '/videos/building1.mp4',

    setSelectedBuilding: (id) => {
      const building = buildings.find((b) => b.id === id)
      if (!building) return
      set({ selectedBuildingId: id, selectedBuilding: building })
      get().refreshAllData()
    },

    setSelectedDate: (date) => {
      set({ selectedDate: date })
    },

    updateRealtimeData: () => {
      const { realtimeCount, selectedBuilding } = get()
      if (!selectedBuilding) return

      const newCount = updateRealtimeCount(realtimeCount, selectedBuilding.capacity)
      const newCongestionIndex = calculateCongestionIndex(newCount, selectedBuilding.capacity)
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
      const { selectedBuilding } = get()
      if (!selectedBuilding) return

      const statCard = generateStatCardData()

      set({
        statCardData: statCard,
        realtimeCount: statCard.realtimeCount,
        hourlyTrend: generateHourlyTrend(selectedBuilding.capacity / 4),
        areaHeatmap: generateAreaHeatmapData(),
        forecastData: generateForecastData(statCard.realtimeCount),
        congestionIndex: calculateCongestionIndex(statCard.realtimeCount, selectedBuilding.capacity),
      })
    },

    setStreamUrl: (url) => {
      set({ streamUrl: url })
    },
  }
})