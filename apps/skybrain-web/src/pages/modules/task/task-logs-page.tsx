import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTaskStore } from "@/stores/task-store"
import type { TaskLogEvent } from "@/types/task"

const eventLabels: Record<TaskLogEvent, string> = {
  started: '开始',
  completed: '完成',
  failed: '失败',
  alert: '告警',
  takeoff: '起飞',
  land: '降落'
}

const eventColors: Record<TaskLogEvent, string> = {
  started: 'bg-green-500',
  completed: 'bg-blue-500',
  failed: 'bg-red-500',
  alert: 'bg-yellow-500',
  takeoff: 'bg-purple-500',
  land: 'bg-cyan-500'
}

export default function TaskLogsPage() {
  const { logs, setLogFilters, logFilters, pagination, setPagination } = useTaskStore()

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (logFilters.taskId && log.taskId !== logFilters.taskId) return false
      if (logFilters.droneId && log.droneId !== logFilters.droneId) return false
      if (logFilters.event && log.event !== logFilters.event) return false
      return true
    })
  }, [logs, logFilters])

  const paginatedLogs = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    return filteredLogs.slice(start, start + pagination.pageSize)
  }, [filteredLogs, pagination.page, pagination.pageSize])

  const totalPages = Math.ceil(filteredLogs.length / pagination.pageSize)

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto flex-1">
        <Card>
          <CardContent className="pt-6">
            {/* 筛选 */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Select
                value={logFilters.taskId || "all"}
                onValueChange={(value) => setLogFilters({ taskId: value === "all" ? undefined : value })}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="任务" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部任务</SelectItem>
                  {Array.from(new Set(logs.map(l => l.taskId))).map(taskId => (
                    <SelectItem key={taskId} value={taskId}>
                      {logs.find(l => l.taskId === taskId)?.taskName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={logFilters.event || "all"}
                onValueChange={(value) => setLogFilters({ event: value === "all" ? undefined : value as TaskLogEvent })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="事件类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {Object.entries(eventLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setLogFilters({ taskId: undefined, event: undefined, droneId: undefined })}
              >
                重置
              </Button>
            </div>

            {/* 统计 */}
            <div className="mb-4 text-sm text-muted-foreground">
              共 {filteredLogs.length} 条日志
            </div>

            {/* 表格 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>任务</TableHead>
                  <TableHead>无人机</TableHead>
                  <TableHead>事件</TableHead>
                  <TableHead>消息</TableHead>
                  <TableHead>详情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{formatTime(log.timestamp)}</TableCell>
                    <TableCell>{log.taskName}</TableCell>
                    <TableCell>{log.droneName}</TableCell>
                    <TableCell>
                      <Badge className={eventColors[log.event]}>
                        {eventLabels[log.event]}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell className="text-muted-foreground">{log.detail || '-'}</TableCell>
                  </TableRow>
                ))}
                {paginatedLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      暂无日志
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* 分页 */}
            {filteredLogs.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  显示 {(pagination.page - 1) * pagination.pageSize + 1}-
                  {Math.min(pagination.page * pagination.pageSize, filteredLogs.length)}，
                  共 {filteredLogs.length} 条
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ page: pagination.page - 1 })}
                    disabled={pagination.page <= 1}
                  >
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ page: pagination.page + 1 })}
                    disabled={pagination.page >= totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}