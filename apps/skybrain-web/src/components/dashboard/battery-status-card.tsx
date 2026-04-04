import { Battery } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Battery as BatteryType } from '@/types/drone'

interface BatteryStatusCardProps {
  batteries: BatteryType[]
}

export function BatteryStatusCard({ batteries }: BatteryStatusCardProps) {
  const chargingCount = batteries.filter(b => b.status === 'charging').length
  const dischargingCount = batteries.filter(b => b.status === 'discharging').length
  const idleCount = batteries.filter(b => b.status === 'idle').length

  const avgHealth = batteries.length > 0
    ? Math.round(batteries.reduce((sum, b) => sum + (b.health || 0), 0) / batteries.length)
    : 0
  const needMaintenance = batteries.filter(b => (b.health || 0) < 60).length

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Battery className="h-4 w-4" />
          设备电池
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{chargingCount}</div>
            <div className="text-xs text-zinc-400">充电中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{dischargingCount}</div>
            <div className="text-xs text-zinc-400">使用中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-300">{idleCount}</div>
            <div className="text-xs text-zinc-400">空闲</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">平均健康度: {avgHealth}%</span>
          <span className={needMaintenance > 0 ? 'text-yellow-500' : 'text-green-500'}>
            需维护: {needMaintenance}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}