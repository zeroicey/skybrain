import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { VideoGrid } from '@/components/monitor/video-grid'
import { useMonitorStore } from '@/stores/monitor-store'
import type { Drone } from '@/types/drone'
import { mockDrones } from '@/data/mock-drones'
import { useVideoChannels, getStreamUrl } from '@/hooks/useVideoChannels'

export default function MultiMonitorPage() {
  const navigate = useNavigate()
  const { activeDrones, setDroneState } = useMonitorStore()
  const { getRandomChannels, loading, channels } = useVideoChannels()
  const [droneVideoMap, setDroneVideoMap] = useState<Map<string, string>>(new Map())

  // 初始化状态
  useEffect(() => {
    if (activeDrones.length === 0) {
      const initialDrones = mockDrones.filter(d => d.status !== 'offline')
      setDroneState(initialDrones, mockDrones)
    }
  }, [])

  // 随机分配视频给无人机
  useEffect(() => {
    if (!loading && channels.length >= 9) {
      const randomChannels = getRandomChannels(9)
      const newMap = new Map<string, string>()

      activeDrones.forEach((drone, index) => {
        if (randomChannels[index]) {
          newMap.set(drone.id, getStreamUrl(randomChannels[index].id, channels))
        }
      })

      setDroneVideoMap(newMap)
    }
  }, [loading, activeDrones, channels])

  const drones = activeDrones.filter(d => d.status !== 'offline')

  const handleFullscreen = (drone: Drone) => {
    navigate(`/monitor/live?drone=${drone.id}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto h-full no-scrollbar">
        <VideoGrid
          drones={drones}
          onFullscreen={handleFullscreen}
          videoMap={droneVideoMap}
        />
      </div>
    </div>
  )
}