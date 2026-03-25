import { create } from 'zustand'
import {
  type Gate,
  type AreaData,
  type TimeSlotData,
  type StatCardData,
  type ForecastData,
  gates,
  generateHourlyTrend,
  generateAreaHeatmapData,
  generateForecastData,
  generateStatCardData,
  updateRealtimeCount,
  calculateCongestionIndex,
  getCongestionLevel,
} from '@/data/mock-gates'

interface GateStore {
  selectedGateId: string
  selectedGate: Gate | null
  selectedDate: string

  realtimeIn: number
  realtimeOut: number
  statCardData: StatCardData
  hourlyTrend: TimeSlotData[]
  areaHeatmap: AreaData[]
  forecastData: ForecastData[]
  congestionIndex: number
  streamUrl: string

  setSelectedGate: (id: string) => void
  setSelectedDate: (date: string) => void
  updateRealtimeData: () => void
  refreshAllData: () => void
  setStreamUrl: (url: string) => void
}

export const useGateStore = create<GateStore>((set, get) => {
  const initialGateId = 'gate-1'
  const initialGate = gates.find((g) => g.id === initialGateId) || gates[0]
  const initialStatCard = generateStatCardData()

  return {
    selectedGateId: initialGateId,
    selectedGate: initialGate,
    selectedDate: new Date().toISOString().split('T')[0],
    realtimeIn: initialStatCard.realtimeIn,
    realtimeOut: initialStatCard.realtimeOut,
    statCardData: initialStatCard,
    hourlyTrend: generateHourlyTrend(initialGate.capacity / 2),
    areaHeatmap: generateAreaHeatmapData(),
    forecastData: generateForecastData(initialStatCard.realtimeIn + initialStatCard.realtimeOut),
    congestionIndex: calculateCongestionIndex(initialStatCard.realtimeIn + initialStatCard.realtimeOut, initialGate.capacity),
    streamUrl: '/videos/gate1.mp4',

    setSelectedGate: (id) => {
      const gate = gates.find((g) => g.id === id)
      if (!gate) return
      set({ selectedGateId: id, selectedGate: gate })
      get().refreshAllData()
    },

    setSelectedDate: (date) => {
      set({ selectedDate: date })
    },

    updateRealtimeData: () => {
      const { realtimeIn, realtimeOut, selectedGate } = get()
      if (!selectedGate) return

      const result = updateRealtimeCount(realtimeIn, realtimeOut, selectedGate.capacity)
      const total = result.in + result.out
      const newCongestionIndex = calculateCongestionIndex(total, selectedGate.capacity)
      const newCongestionLevel = getCongestionLevel(newCongestionIndex)

      set((state) => ({
        realtimeIn: result.in,
        realtimeOut: result.out,
        congestionIndex: newCongestionIndex,
        statCardData: {
          ...state.statCardData,
          realtimeIn: result.in,
          realtimeOut: result.out,
          congestionLevel: newCongestionLevel,
        },
      }))
    },

    refreshAllData: () => {
      const { selectedGate } = get()
      if (!selectedGate) return

      const statCard = generateStatCardData()

      set({
        statCardData: statCard,
        realtimeIn: statCard.realtimeIn,
        realtimeOut: statCard.realtimeOut,
        hourlyTrend: generateHourlyTrend(selectedGate.capacity / 2),
        areaHeatmap: generateAreaHeatmapData(),
        forecastData: generateForecastData(statCard.realtimeIn + statCard.realtimeOut),
        congestionIndex: calculateCongestionIndex(statCard.realtimeIn + statCard.realtimeOut, selectedGate.capacity),
      })
    },

    setStreamUrl: (url) => {
      set({ streamUrl: url })
    },
  }
})