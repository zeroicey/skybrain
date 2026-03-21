import { useNavigate } from "react-router"
import { useTaskStore } from "@/stores/task-store"
import { TaskForm } from "@/components/task/task-form"
import type { Task } from "@/types/task"

export default function TaskCreatePage() {
  const navigate = useNavigate()
  const { addTask, tasks } = useTaskStore()

  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: String(tasks.length + 1),
      createdAt: new Date().toISOString()
    }
    addTask(newTask)
    navigate('/tasks')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto flex-1">
        <TaskForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}