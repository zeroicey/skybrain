import { useTaskStore } from '@/stores/task-store'

export default function TaskDetailNav() {
  const { selectedTask } = useTaskStore()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">{selectedTask?.name || '任务详情'}</span>
    </div>
  )
}