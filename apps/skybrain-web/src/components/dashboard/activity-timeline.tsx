import { Activity, Plane, AlertTriangle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TaskLog } from '@/types/task'

interface ActivityTimelineProps {
  logs: TaskLog[]
}

function getActivityIcon(event: string) {
  switch (event) {
    case 'started':
      return <Plane className="h-4 w-4 text-blue-500" />
    case 'completed':
      return <Activity className="h-4 w-4 text-green-500" />
    case 'failed':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case 'alert':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'takeoff':
      return <Plane className="h-4 w-4 text-sky-500" />
    case 'land':
      return <Plane className="h-4 w-4 text-orange-500" />
    default:
      return <Clock className="h-4 w-4 text-zinc-500" />
  }
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  if (hours > 0) return `${hours}小时前`
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
  // 取最新的10条日志
  const recentLogs = [...logs].reverse().slice(0, 10)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          最新活动
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
          {recentLogs.map((log, index) => (
            <div key={log.id} className="flex items-start gap-3">
              {/* 时间线 */}
              <div className="flex flex-col items-center">
                <div className="mt-1">
                  {getActivityIcon(log.event)}
                </div>
                {index < recentLogs.length - 1 && (
                  <div className="w-px h-full bg-zinc-800 mt-1" />
                )}
              </div>

              {/* 内容 */}
              <div className="flex-1 pb-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">{log.taskName}</span>
                  <span className="text-xs text-zinc-500 whitespace-nowrap">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">{log.message}</div>
                {log.detail && (
                  <div className="text-xs text-zinc-500 mt-1">{log.detail}</div>
                )}
              </div>
            </div>
          ))}
          {recentLogs.length === 0 && (
            <div className="text-center text-zinc-500 py-4 text-sm">
              暂无活动记录
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}