import { Drone, Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Drone as DroneType } from '@/types/drone'

interface DroneStatusCardProps {
  drones: DroneType[]
}

export function DroneStatusCard({ drones }: DroneStatusCardProps) {
  const onlineCount = drones.filter(d => d.status === 'online').length
  const warningCount = drones.filter(d => d.status === 'warning').length
  const offlineCount = drones.filter(d => d.status === 'offline').length

  const batteryHigh = drones.filter(d => d.battery > 80).length
  const batteryMedium = drones.filter(d => d.battery > 50 && d.battery <= 80).length
  const batteryLow = drones.filter(d => d.battery <= 50).length

  const getPercentage = (count: number) => {
    if (drones.length === 0) return 0
    return (count / drones.length) * 100
  }

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
        <div className="space-y-2">
          <div className="text-xs text-zinc-400">电池分布</div>
          <div className="flex gap-2 text-xs">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>&gt;80%</span>
                <span>{batteryHigh}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${getPercentage(batteryHigh)}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>50-80%</span>
                <span>{batteryMedium}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 transition-all" style={{ width: `${getPercentage(batteryMedium)}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>&lt;50%</span>
                <span>{batteryLow}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${getPercentage(batteryLow)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}