import { Plane, Battery, Signal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Drone } from '@/types/drone'

interface DroneListCardProps {
  drones: Drone[]
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online':
      return 'text-green-500'
    case 'warning':
      return 'text-yellow-500'
    case 'offline':
      return 'text-red-500'
    default:
      return 'text-zinc-500'
  }
}

function getBatteryColor(battery: number) {
  if (battery > 80) return 'text-green-500'
  if (battery > 50) return 'text-yellow-500'
  return 'text-red-500'
}

export function DroneListCard({ drones }: DroneListCardProps) {
  // 按状态排序：在线 > 警告 > 离线
  const sortedDrones = [...drones].sort((a, b) => {
    const statusOrder = { online: 0, warning: 1, offline: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Plane className="h-4 w-4" />
          无人机列表
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
          {sortedDrones.map(drone => (
            <div
              key={drone.id}
              className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${drone.status === 'online' ? 'bg-green-500' : drone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <div>
                  <div className="text-sm font-medium">{drone.name}</div>
                  <div className="text-xs text-zinc-500">高度: {drone.altitude}m</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Battery className="h-3 w-3" />
                  <span className={getBatteryColor(drone.battery)}>{drone.battery}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Signal className="h-3 w-3" />
                  <span className={getStatusColor(drone.status)}>{drone.status === 'online' ? '在线' : drone.status === 'warning' ? '警告' : '离线'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}