import { Battery, Zap, Power, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Battery as BatteryType } from '@/types/drone'

interface BatteryStatusCardProps {
  batteries: BatteryType[]
}

export function BatteryStatusCard({ batteries }: BatteryStatusCardProps) {
  const chargingCount = batteries.filter(b => b.status === 'charging').length
  const dischargingCount = batteries.filter(b => b.status === 'discharging').length
  const idleCount = batteries.filter(b => b.status === 'idle').length
  const maintenanceCount = batteries.filter(b => b.status === 'maintenance').length

  const avgHealth = batteries.length > 0
    ? Math.round(batteries.reduce((sum, b) => sum + (b.health || 0), 0) / batteries.length)
    : 0
  const needMaintenance = batteries.filter(b => (b.health || 0) < 60).length

  // 按电量排序显示电池
  const sortedBatteries = [...batteries]
    .sort((a, b) => a.电量 - b.电量)
    .slice(0, 8)

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-500'
    if (health >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getBatteryIcon = (status: string) => {
    if (status === 'charging') return <Zap className="h-3 w-3 text-green-500" />
    if (status === 'discharging') return <Power className="h-3 w-3 text-yellow-500" />
    if (status === 'maintenance') return <AlertTriangle className="h-3 w-3 text-red-500" />
    return <Battery className="h-3 w-3 text-zinc-500" />
  }

  const getStatusLabel = (status: string) => {
    if (status === 'charging') return '充电中'
    if (status === 'discharging') return '使用中'
    if (status === 'maintenance') return '维护'
    return '空闲'
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Battery className="h-4 w-4" />
          设备电池
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
            <div className="text-lg font-bold text-green-500">{chargingCount}</div>
            <div className="text-xs text-zinc-400">充电中</div>
          </div>
          <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
            <div className="text-lg font-bold text-yellow-500">{dischargingCount}</div>
            <div className="text-xs text-zinc-400">使用中</div>
          </div>
          <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
            <div className="text-lg font-bold text-zinc-300">{idleCount}</div>
            <div className="text-xs text-zinc-400">空闲</div>
          </div>
          <div className="text-center p-2 bg-zinc-800/50 rounded-lg">
            <div className="text-lg font-bold text-orange-500">{maintenanceCount}</div>
            <div className="text-xs text-zinc-400">维护</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs mb-4">
          <span className="text-zinc-400">平均健康度: {avgHealth}%</span>
          <span className={needMaintenance > 0 ? 'text-yellow-500' : 'text-green-500'}>
            需维护: {needMaintenance}
          </span>
        </div>

        {/* 电池列表 */}
        <div>
          <div className="text-xs text-zinc-400 mb-2">电池状态</div>
          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
            {sortedBatteries.map(battery => (
              <div key={battery.id} className="flex items-center justify-between text-xs p-1.5 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2 min-w-0">
                  {getBatteryIcon(battery.status)}
                  <span className="truncate">{battery.serialNumber}</span>
                  <span className="text-zinc-500">{getStatusLabel(battery.status)}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={getHealthColor(battery.health || 0)}>
                    {battery.health || 0}%
                  </span>
                  <span className={battery.电量 <= 30 ? 'text-red-500' : 'text-zinc-400'}>
                    {battery.电量}%
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