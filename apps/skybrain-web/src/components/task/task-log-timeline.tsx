import type { TaskLog } from "@/types/task"

interface TaskLogTimelineProps {
  logs: TaskLog[]
}

const eventIcons: Record<string, string> = {
  started: "🟢",
  completed: "✅",
  failed: "❌",
  alert: "⚠️",
  takeoff: "🛫",
  land: "🛬"
}

const eventLabels: Record<string, string> = {
  started: "开始",
  completed: "完成",
  failed: "失败",
  alert: "告警",
  takeoff: "起飞",
  land: "降落"
}

export function TaskLogTimeline({ logs }: TaskLogTimelineProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">任务日志</h3>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={log.id} className="flex gap-3">
            {/* 时间线 */}
            <div className="flex flex-col items-center">
              <span className="text-lg">{eventIcons[log.event]}</span>
              {index < logs.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-1" />
              )}
            </div>
            {/* 内容 */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{eventLabels[log.event]}</span>
                <span className="text-sm text-muted-foreground">
                  {formatTime(log.timestamp)}
                </span>
              </div>
              <p className="text-sm mt-1">{log.message}</p>
              {log.detail && (
                <p className="text-xs text-muted-foreground mt-1">{log.detail}</p>
              )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-sm text-muted-foreground">暂无日志</p>
        )}
      </div>
    </div>
  )
}