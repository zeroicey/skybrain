import { DroneSelector } from '@/components/monitor/drone-selector'
import { mockDrones } from '@/data/mock-drones'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function MonitorLiveNav() {
  const navigate = useNavigate()
  const [selectedDroneId, setSelectedDroneId] = useState<string>('')

  // 从 URL 读取当前选中的无人机
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const drone = params.get('drone')
    if (drone) {
      setSelectedDroneId(drone)
    }
  }, [])

  const handleDroneChange = (droneId: string) => {
    setSelectedDroneId(droneId)
    // 更新 URL 参数
    const params = new URLSearchParams(window.location.search)
    if (droneId) {
      params.set('drone', droneId)
    } else {
      params.delete('drone')
    }
    navigate(`?${params.toString()}`)
  }

  const selectedDrone = mockDrones.find(d => d.id === selectedDroneId)

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">视频监控</span>
      <div className="flex items-center gap-4">
        <DroneSelector
          value={selectedDroneId}
          onChange={handleDroneChange}
          placeholder="选择无人机"
        />
        {selectedDrone && (
          <Badge variant="outline" className="gap-1">
            <span className={`w-2 h-2 rounded-full ${
              selectedDrone.status === 'online' ? 'bg-green-500' :
              selectedDrone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            {selectedDrone.status === 'online' ? '在线' :
             selectedDrone.status === 'warning' ? '警告' : '离线'}
          </Badge>
        )}
      </div>
    </div>
  )
}