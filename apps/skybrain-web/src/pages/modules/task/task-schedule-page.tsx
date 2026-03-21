import { useState } from "react"
import { useNavigate } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTaskStore } from "@/stores/task-store"
import { ScheduleCalendar } from "@/components/task/schedule-calendar"
import { ScheduleList } from "@/components/task/schedule-list"

type ViewMode = 'calendar' | 'list'

export default function TaskSchedulePage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const { scheduledTasks, toggleScheduledTask, deleteScheduledTask } = useTaskStore()

  const handleToggle = (id: string) => {
    toggleScheduledTask(id)
  }

  const handleDelete = (id: string) => {
    deleteScheduledTask(id)
  }

  const handleEdit = (task: any) => {
    console.log('Edit task:', task)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto flex-1">
        <Card>
          <CardContent className="pt-6">
            {/* 顶部操作栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  日历视图
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  列表视图
                </Button>
              </div>
              <Button onClick={() => navigate('/tasks/create')}>
                <Plus className="mr-2 h-4 w-4" />
                新建定时任务
              </Button>
            </div>

            {/* 视图内容 */}
            {viewMode === 'calendar' ? (
              <ScheduleCalendar scheduledTasks={scheduledTasks} />
            ) : (
              <ScheduleList
                scheduledTasks={scheduledTasks}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}