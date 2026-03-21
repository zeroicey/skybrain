import { useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useTaskStore } from "@/stores/task-store"
import { TaskForm } from "@/components/task/task-form"
import type { Task } from "@/types/task"

export default function TaskEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, updateTask, selectTask, selectedTask } = useTaskStore()

  useEffect(() => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      selectTask(task)
    }
  }, [id, tasks, selectTask])

  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (id) {
      updateTask(id, taskData)
      navigate(`/tasks/${id}`)
    }
  }

  if (!selectedTask) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="text-center text-muted-foreground">
            任务不存在
          </div>
        </div>
      </div>
    )
  }

  const isRunning = selectedTask.status === 'running'

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto flex-1">
        {isRunning && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            任务执行中，部分字段不可编辑
          </div>
        )}
        <TaskForm
          onSubmit={handleSubmit}
          initialData={selectedTask}
          isEdit={true}
        />
      </div>
    </div>
  )
}