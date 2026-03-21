import { useTaskStore } from '@/stores/task-store'

export default function TaskEditNav() {
  const { selectedTask } = useTaskStore()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">编辑任务 - {selectedTask?.name || ''}</span>
    </div>
  )
}