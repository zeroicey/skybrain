import { ListTodo, Play, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/types/task'

interface TaskOverviewCardProps {
  tasks: Task[]
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
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">失败/取消: {failedCount}</span>
          <span className={successRate >= 80 ? 'text-green-500' : 'text-yellow-500'}>
            成功率: {successRate}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}