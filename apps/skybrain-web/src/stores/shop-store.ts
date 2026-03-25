import { create } from 'zustand'
import {
  type Shop,
  type AreaData,
  type TimeSlotData,
  type StatCardData,
  type ForecastData,
  shops,
  generateHourlyTrend,
  generateAreaHeatmapData,
  generateForecastData,
  generateStatCardData,
  updateRealtimeCount,
  calculateCongestionIndex,
  getCongestionLevel,
} from '@/data/mock-shops'

interface ShopStore {
  selectedShopId: string
  selectedShop: Shop | null
  selectedDate: string
  selectedDistrict: string
  selectedType: string

  realtimeCount: number
  statCardData: StatCardData
  hourlyTrend: TimeSlotData[]
  areaHeatmap: AreaData[]
  forecastData: ForecastData[]
  congestionIndex: number
  streamUrl: string

  setSelectedShop: (id: string) => void
  setSelectedDate: (date: string) => void
  setSelectedDistrict: (district: string) => void
  setSelectedType: (type: string) => void
  updateRealtimeData: () => void
  refreshAllData: () => void
  setStreamUrl: (url: string) => void
}

export const useShopStore = create<ShopStore>((set, get) => {
  const initialShopId = 'shop-1'
  const initialShop = shops.find((s) => s.id === initialShopId) || shops[0]
  const initialStatCard = generateStatCardData()

  return {
    selectedShopId: initialShopId,
    selectedShop: initialShop,
    selectedDate: new Date().toISOString().split('T')[0],
    selectedDistrict: 'all',
    selectedType: 'all',
    realtimeCount: initialStatCard.realtimeCount,
    statCardData: initialStatCard,
    hourlyTrend: generateHourlyTrend(initialShop.capacity / 4),
    areaHeatmap: generateAreaHeatmapData(),
    forecastData: generateForecastData(initialStatCard.realtimeCount),
    congestionIndex: calculateCongestionIndex(initialStatCard.realtimeCount, initialShop.capacity),
    streamUrl: '/videos/shop1.mp4',

    setSelectedShop: (id) => {
      const shop = shops.find((s) => s.id === id)
      if (!shop) return
      set({ selectedShopId: id, selectedShop: shop })
      get().refreshAllData()
    },

    setSelectedDate: (date) => {
      set({ selectedDate: date })
    },

    setSelectedDistrict: (district) => {
      set({ selectedDistrict: district })
    },

    setSelectedType: (type) => {
      set({ selectedType: type })
    },

    updateRealtimeData: () => {
      const { realtimeCount, selectedShop } = get()
      if (!selectedShop) return

      const newCount = updateRealtimeCount(realtimeCount, selectedShop.capacity)
      const newCongestionIndex = calculateCongestionIndex(newCount, selectedShop.capacity)
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
      const { selectedShop } = get()
      if (!selectedShop) return

      const statCard = generateStatCardData()

      set({
        statCardData: statCard,
        realtimeCount: statCard.realtimeCount,
        hourlyTrend: generateHourlyTrend(selectedShop.capacity / 4),
        areaHeatmap: generateAreaHeatmapData(),
        forecastData: generateForecastData(statCard.realtimeCount),
        congestionIndex: calculateCongestionIndex(statCard.realtimeCount, selectedShop.capacity),
      })
    },

    setStreamUrl: (url) => {
      set({ streamUrl: url })
    },
  }
})