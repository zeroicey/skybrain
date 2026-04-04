import { BarChart3, Clock, Route, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FlightStatsCardProps {
  todayFlightMinutes: number
  todayTasks: number
  todayDistance: number
  successRate: number
}

export function FlightStatsCard({
  todayFlightMinutes,
  todayTasks,
  todayDistance,
  successRate
}: FlightStatsCardProps) {
  const hours = Math.floor(todayFlightMinutes / 60)
  const minutes = todayFlightMinutes % 60
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          今日飞行统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold">{timeDisplay}</div>
            <div className="text-xs text-zinc-400">飞行时长</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Route className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold">{todayTasks}</div>
            <div className="text-xs text-zinc-400">任务次数</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold">{todayDistance.toFixed(1)} km</div>
            <div className="text-xs text-zinc-400">飞行里程</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="text-xl font-bold text-green-500">{successRate}%</div>
            <div className="text-xs text-zinc-400">任务成功率</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}