import { useEffect } from 'react'
import { VideoGrid } from '@/components/monitor/video-grid'
import { useMonitorStore } from '@/stores/monitor-store'
import type { Drone } from '@/types/drone'
import { mockDrones } from '@/data/mock-drones'

export default function MultiMonitorPage() {
  const { activeDrones, setDroneState } = useMonitorStore()

  // 初始化状态
  useEffect(() => {
    if (activeDrones.length === 0) {
      const initialDrones = mockDrones.filter(d => d.status !== 'offline')
      setDroneState(initialDrones, mockDrones)
    }
  }, [])

  const drones = activeDrones.filter(d => d.status !== 'offline')

  const handleFullscreen = (drone: Drone) => {
    console.log('进入全屏:', drone.name)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto h-full no-scrollbar">
        <VideoGrid
          drones={drones}
          onFullscreen={handleFullscreen}
        />
      </div>
    </div>
  )
}