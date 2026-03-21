import { Progress } from "@/components/ui/progress"
import type { TaskStatus } from "@/types/task"

interface TaskProgressProps {
  status: TaskStatus
}

export function TaskProgress({ status }: TaskProgressProps) {
  const getProgress = () => {
    switch (status) {
      case 'pending':
        return 0
      case 'running':
        return 50
      case 'completed':
        return 100
      case 'failed':
      case 'cancelled':
        return 0
      default:
        return 0
    }
  }

  const progress = getProgress()

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>任务进度</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>开始</span>
        <span>当前</span>
        <span>结束</span>
      </div>
    </div>
  )
}