import { ListTodo } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/types/task'

interface TaskStatsCardProps {
  tasks: Task[]
}

const TASK_TYPE_LABELS: Record<string, string> = {
  patrol: '巡逻',
  inspection: '巡检',
  support: '保障',
  delivery: '配送',
  rescue: '搜救',
  custom: '自定义'
}

const PRIORITY_LABELS: Record<string, string> = {
  low: '低',
  normal: '普通',
  high: '高',
  urgent: '紧急'
}

export function TaskStatsCard({ tasks }: TaskStatsCardProps) {
  const today = new Date().toISOString().split('T')[0]

  // 任务类型统计
  const taskTypes = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 优先级统计
  const priorities = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 今日任务
  const todayTasks = tasks.filter(t => t.startTime?.startsWith(today))
  const runningToday = todayTasks.filter(t => t.status === 'running').length
  const completedToday = todayTasks.filter(t => t.status === 'completed').length

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          任务统计
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 今日任务 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted/50 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-500">{runningToday}</div>
            <div className="text-xs text-muted-foreground">进行中</div>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg text-center">
            <div className="text-lg font-bold text-green-500">{completedToday}</div>
            <div className="text-xs text-muted-foreground">今日完成</div>
          </div>
        </div>

        {/* 任务类型 */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">任务类型分布</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(taskTypes).map(([type, count]) => (
              <span key={type} className="px-2 py-1 text-xs bg-muted rounded">
                {TASK_TYPE_LABELS[type] || type}: {count}
              </span>
            ))}
          </div>
        </div>

        {/* 优先级 */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">优先级分布</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(priorities).map(([priority, count]) => (
              <span
                key={priority}
                className={`px-2 py-1 text-xs rounded ${
                  priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                  priority === 'high' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400' :
                  priority === 'normal' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {PRIORITY_LABELS[priority] || priority}: {count}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}