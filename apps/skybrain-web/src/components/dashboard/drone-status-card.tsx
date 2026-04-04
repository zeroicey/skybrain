import { Drone, Battery } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Drone as DroneType } from '@/types/drone'

interface DroneStatusCardProps {
  drones: DroneType[]
}

export function DroneStatusCard({ drones }: DroneStatusCardProps) {
  const onlineCount = drones.filter(d => d.status === 'online').length
  const warningCount = drones.filter(d => d.status === 'warning').length
  const offlineCount = drones.filter(d => d.status === 'offline').length

  // 获取电池电量最低的无人机
  const lowBatteryDrones = [...drones]
    .sort((a, b) => a.battery - b.battery)
    .slice(0, 5)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Drone className="h-4 w-4" />
          无人机状态
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{onlineCount}</div>
            <div className="text-xs text-zinc-400">在线</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
            <div className="text-xs text-zinc-400">警告</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{offlineCount}</div>
            <div className="text-xs text-zinc-400">离线</div>
          </div>
        </div>

        {/* 电池分布 - 改为垂直排列 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">电池分布</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-500 w-12">&gt;80%</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${(drones.filter(d => d.battery > 80).length / drones.length) * 100}%` }} />
              </div>
              <span className="text-xs w-4">{drones.filter(d => d.battery > 80).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-yellow-500 w-12">50-80%</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${(drones.filter(d => d.battery > 50 && d.battery <= 80).length / drones.length) * 100}%` }} />
              </div>
              <span className="text-xs w-4">{drones.filter(d => d.battery > 50 && d.battery <= 80).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 w-12">&lt;50%</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${(drones.filter(d => d.battery <= 50).length / drones.length) * 100}%` }} />
              </div>
              <span className="text-xs w-4">{drones.filter(d => d.battery <= 50).length}</span>
            </div>
          </div>
        </div>

        {/* 电池电量最低的无人机 */}
        <div className="mt-4">
          <div className="text-xs text-zinc-400 mb-2">电池电量</div>
          <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
            {lowBatteryDrones.map(drone => (
              <div key={drone.id} className="flex items-center justify-between text-xs p-1 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${drone.status === 'online' ? 'bg-green-500' : drone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <span>{drone.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Battery className="h-3 w-3" />
                  <span className={drone.battery <= 50 ? 'text-red-500' : drone.battery <= 80 ? 'text-yellow-500' : 'text-green-500'}>
                    {drone.battery}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}