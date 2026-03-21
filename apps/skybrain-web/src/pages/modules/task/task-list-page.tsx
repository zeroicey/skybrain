import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTaskStore } from "@/stores/task-store"
import { mockTasks, mockScheduledTasks, mockTaskLogs } from "@/data/mock-tasks"
import { TaskTable } from "@/components/task/task-table"
import { TaskFilters } from "@/components/task/task-filters"

export default function TaskListPage() {
  const {
    tasks,
    setTasks,
    filters,
    setFilters,
    pagination,
    setPagination,
    deleteTask,
    setScheduledTasks,
    setLogs
  } = useTaskStore()

  // 初始化数据
  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(mockTasks)
      setScheduledTasks(mockScheduledTasks)
      setLogs(mockTaskLogs)
    }
  }, [tasks.length, setTasks, setScheduledTasks, setLogs])

  // 筛选任务
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.type && task.type !== filters.type) return false
      if (filters.status && task.status !== filters.status) return false
      if (filters.search && !task.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [tasks, filters])

  // 分页
  const paginatedTasks = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    return filteredTasks.slice(start, start + pagination.pageSize)
  }, [filteredTasks, pagination.page, pagination.pageSize])

  const handleDelete = (id: string) => {
    deleteTask(id)
  }

  const handlePageChange = (page: number) => {
    setPagination({ page })
  }

  const totalPages = Math.ceil(filteredTasks.length / pagination.pageSize)

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto flex-1">
        <Card>
          <CardContent className="pt-6">
            {/* 筛选 */}
            <TaskFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={() => setFilters({ type: undefined, status: undefined, search: undefined })}
            />

            {/* 表格 */}
            <TaskTable tasks={paginatedTasks} onDelete={handleDelete} />

            {/* 分页 */}
            {filteredTasks.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  显示 {(pagination.page - 1) * pagination.pageSize + 1}-
                  {Math.min(pagination.page * pagination.pageSize, filteredTasks.length)}，
                  共 {filteredTasks.length} 条
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
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