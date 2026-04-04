import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TaskLog } from '@/types/task'

interface AlertListProps {
  logs: TaskLog[]
}

function formatAlertTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function getAlertIcon(event: string) {
  switch (event) {
    case 'alert':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'completed':
      return <Info className="h-4 w-4 text-green-500" />
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

export function AlertList({ logs }: AlertListProps) {
  // 过滤出告警相关的日志
  const alertLogs = logs
    .filter(log => ['alert', 'failed', 'completed'].includes(log.event))
    .slice(0, 5)

  return (
    <Card className="bg-card border-border max-h-75 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            实时告警
          </span>
          <span className="text-xs text-muted-foreground cursor-pointer hover:text-zinc-300">
            全部 →
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto no-scrollbar">
        <div className="space-y-3">
          {alertLogs.map(log => (
            <div key={log.id} className="flex items-start gap-3 text-xs">
              {getAlertIcon(log.event)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{log.droneName || log.taskName}</span>
                  <span className="text-muted-foreground whitespace-nowrap ml-2">
                    {formatAlertTime(log.timestamp)}
                  </span>
                </div>
                <div className="text-muted-foreground truncate">{log.message}</div>
              </div>
            </div>
          ))}
          {alertLogs.length === 0 && (
            <div className="text-center text-muted-foreground py-4 text-xs">
              暂无告警
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}