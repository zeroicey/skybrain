import { ListTodo, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/types/task'

interface TaskOverviewCardProps {
  tasks: Task[]
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-500',
  high: 'text-yellow-500',
  normal: 'text-blue-500',
  low: 'text-zinc-500'
}

const STATUS_COLORS: Record<string, string> = {
  running: 'text-blue-500',
  pending: 'text-zinc-400',
  completed: 'text-green-500',
  failed: 'text-red-500',
  cancelled: 'text-zinc-600'
}

export function TaskOverviewCard({ tasks }: TaskOverviewCardProps) {
  const today = new Date().toISOString().split('T')[0]

  const runningCount = tasks.filter(t => t.status === 'running').length
  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const completedToday = tasks.filter(t =>
    t.status === 'completed' && t.endTime?.startsWith(today)
  ).length
  const failedCount = tasks.filter(t =>
    t.status === 'failed' || t.status === 'cancelled'
  ).length

  const successRate = tasks.length > 0
    ? Math.round(((tasks.length - failedCount) / tasks.length) * 100)
    : 100

  // 获取最近的任务
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          任务概览
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{runningCount}</div>
            <div className="text-xs text-zinc-400">进行中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-300">{pendingCount}</div>
            <div className="text-xs text-zinc-400">待执行</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{completedToday}</div>
            <div className="text-xs text-zinc-400">今日完成</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs mb-4">
          <span className="text-zinc-400">失败/取消: {failedCount}</span>
          <span className={successRate >= 80 ? 'text-green-500' : 'text-yellow-500'}>
            成功率: {successRate}%
          </span>
        </div>

        {/* 最近任务 */}
        <div className="mt-2">
          <div className="text-xs text-zinc-400 mb-2">最近任务</div>
          <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between text-xs p-1.5 bg-zinc-800/50 rounded">
                <div className="flex items-center gap-2 min-w-0">
                  {task.status === 'running' && <Play className="h-3 w-3 text-blue-500 shrink-0" />}
                  {task.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />}
                  {task.status === 'failed' && <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />}
                  {task.status === 'pending' && <Clock className="h-3 w-3 text-zinc-500 shrink-0" />}
                  <span className="truncate">{task.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={PRIORITY_COLORS[task.priority]}>
                    {task.priority === 'urgent' ? '紧急' : task.priority === 'high' ? '高' : task.priority === 'normal' ? '普通' : '低'}
                  </span>
                  <span className={STATUS_COLORS[task.status]}>
                    {task.status === 'running' ? '进行中' : task.status === 'pending' ? '待执行' : task.status === 'completed' ? '完成' : task.status === 'failed' ? '失败' : '已取消'}
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