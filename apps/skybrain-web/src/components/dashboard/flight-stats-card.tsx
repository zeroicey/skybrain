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
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          今日飞行统计
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 主要统计 */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{timeDisplay}</div>
            <div className="text-xs text-muted-foreground">飞行时长</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <Route className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{todayTasks}</div>
            <div className="text-xs text-muted-foreground">任务次数</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <BarChart3 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-lg font-bold">{todayDistance.toFixed(1)} km</div>
            <div className="text-xs text-muted-foreground">飞行里程</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <div className="text-lg font-bold text-green-500">{successRate}%</div>
            <div className="text-xs text-muted-foreground">成功率</div>
          </div>
        </div>

        {/* 飞行效率 */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">飞行效率</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <div className="text-sm font-bold">{Math.round(todayFlightMinutes / todayTasks)}m</div>
              <div className="text-xs text-muted-foreground">次均时长</div>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <div className="text-sm font-bold">{(todayDistance / (todayFlightMinutes / 60)).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">km/h 均速</div>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <div className="text-sm font-bold">{(todayDistance / todayTasks).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">km/次</div>
            </div>
          </div>
        </div>

        {/* 飞行时段分布 */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">今日时段分布</div>
          <div className="flex gap-1 h-16 items-end">
            {[35, 45, 60, 80, 55, 40, 25, 30, 50, 70, 85, 60].map((height, i) => (
              <div key={i} className="flex-1 bg-muted rounded-t" style={{ height: `${height}%` }}>
                <div className="h-full bg-blue-600/60 rounded-t" />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0时</span>
            <span>6时</span>
            <span>12时</span>
            <span>18时</span>
            <span>24时</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}