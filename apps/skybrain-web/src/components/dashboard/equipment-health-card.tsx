import { Wrench, Plane } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Battery as BatteryType } from '@/types/drone'
import { mockDeviceDrones } from '@/data/mock-device-drones'

interface EquipmentHealthCardProps {
  batteries: BatteryType[]
}

export function EquipmentHealthCard({ batteries }: EquipmentHealthCardProps) {
  // 电池健康统计
  const healthyBatteries = batteries.filter(b => (b.health || 0) >= 80).length
  const warningBatteries = batteries.filter(b => (b.health || 0) >= 50 && (b.health || 0) < 80).length
  const criticalBatteries = batteries.filter(b => (b.health || 0) < 50).length

  // 无人机使用情况
  const totalDrones = mockDeviceDrones.length
  const flyingDrones = mockDeviceDrones.filter(d => d.status === 'flying').length
  const idleDrones = mockDeviceDrones.filter(d => d.status === 'online').length
  const chargingDrones = mockDeviceDrones.filter(d => d.status === 'charging').length

  // 计算平均飞行时长
  const avgFlightTime = mockDeviceDrones.length > 0
    ? (mockDeviceDrones.reduce((sum, d) => sum + d.totalFlightTime, 0) / mockDeviceDrones.length).toFixed(1)
    : 0

  // 总起降次数
  const totalFlights = mockDeviceDrones.reduce((sum, d) => sum + d.totalFlights, 0)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          设备健康
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 无人机状态 */}
        <div>
          <div className="text-xs text-zinc-400 mb-2">无人机状态</div>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
              <Plane className="h-4 w-4 mx-auto mb-1 text-blue-400" />
              <div className="text-sm font-bold">{totalDrones}</div>
              <div className="text-xs text-zinc-500">总数量</div>
            </div>
            <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
              <div className="text-sm font-bold text-green-500">{flyingDrones}</div>
              <div className="text-xs text-zinc-500">飞行中</div>
            </div>
            <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
              <div className="text-sm font-bold text-yellow-500">{chargingDrones}</div>
              <div className="text-xs text-zinc-500">充电中</div>
            </div>
            <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
              <div className="text-sm font-bold text-zinc-300">{idleDrones}</div>
              <div className="text-xs text-zinc-500">空闲</div>
            </div>
          </div>
        </div>

        {/* 电池健康 */}
        <div>
          <div className="text-xs text-zinc-400 mb-2">电池健康</div>
          <div className="flex gap-2 text-xs">
            <div className="flex-1 p-2 bg-zinc-800/50 rounded-lg text-center">
              <div className="text-sm font-bold text-green-500">{healthyBatteries}</div>
              <div className="text-zinc-500">良好</div>
            </div>
            <div className="flex-1 p-2 bg-zinc-800/50 rounded-lg text-center">
              <div className="text-sm font-bold text-yellow-500">{warningBatteries}</div>
              <div className="text-zinc-500">警告</div>
            </div>
            <div className="flex-1 p-2 bg-zinc-800/50 rounded-lg text-center">
              <div className="text-sm font-bold text-red-500">{criticalBatteries}</div>
              <div className="text-zinc-500">需维护</div>
            </div>
          </div>
        </div>

        {/* 飞行统计 */}
        <div>
          <div className="text-xs text-zinc-400 mb-2">累计飞行数据</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-zinc-800/50 rounded-lg">
              <div className="text-sm font-bold">{avgFlightTime}h</div>
              <div className="text-xs text-zinc-500">平均飞行时长</div>
            </div>
            <div className="p-2 bg-zinc-800/50 rounded-lg">
              <div className="text-sm font-bold">{totalFlights}</div>
              <div className="text-xs text-zinc-500">总起降次数</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}