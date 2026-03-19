import { useMonitorStore } from '@/stores/monitor-store'
import { QuickAddDropdown } from '@/components/monitor/quick-add-dropdown'
import type { Drone } from '@/types/drone'

export default function MonitorMultiNav() {
  const { droneCount, activeDrones } = useMonitorStore()

  const handleAddDrone = (drone: Drone) => {
    const updatedDrones = activeDrones.map(d =>
      d.id === drone.id ? { ...d, status: 'online' as const } : d
    )
    useMonitorStore.setState({
      activeDrones: updatedDrones,
      droneCount: updatedDrones.filter(d => d.status !== 'offline').length
    })
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">多路监控</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          当前显示: {droneCount} 个无人机
        </span>
        <QuickAddDropdown availableDrones={activeDrones} onAdd={handleAddDrone} />
      </div>
    </div>
  )
}