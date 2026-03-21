import { useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pause, X, RotateCw, Play } from "lucide-react"
import { useTaskStore } from "@/stores/task-store"
import { mockTaskLogs } from "@/data/mock-tasks"
import { TaskProgress } from "@/components/task/task-progress"
import { TaskLogTimeline } from "@/components/task/task-log-timeline"
import { TASK_STATUS_LABELS, TASK_TYPE_LABELS, TASK_PRIORITY_LABELS } from "@/types/task"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  cancelled: "bg-gray-500"
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, selectTask, selectedTask, logs, setLogs } = useTaskStore()

  useEffect(() => {
    if (logs.length === 0) {
      setLogs(mockTaskLogs)
    }
  }, [logs.length, setLogs])

  useEffect(() => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      selectTask(task)
    }
  }, [id, tasks, selectTask])

  if (!selectedTask) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Button variant="ghost" onClick={() => navigate('/tasks')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回任务列表
          </Button>
          <div className="mt-4 text-center text-muted-foreground">
            任务不存在
          </div>
        </div>
      </div>
    )
  }

  const taskLogs = logs.filter(log => log.taskId === selectedTask.id)

  const handleAction = (action: string) => {
    console.log(`执行操作: ${action}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 overflow-auto flex-1">
        {/* 返回按钮 */}
        <Button variant="ghost" onClick={() => navigate('/tasks')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回任务列表
        </Button>

        {/* 顶部：状态标签 + 操作 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{selectedTask.name}</h1>
            <Badge className={statusColors[selectedTask.status]}>
              {TASK_STATUS_LABELS[selectedTask.status]}
            </Badge>
          </div>
          <div className="flex gap-2">
            {selectedTask.status === 'running' && (
              <Button variant="outline" onClick={() => handleAction('pause')}>
                <Pause className="mr-2 h-4 w-4" />
                暂停
              </Button>
            )}
            {selectedTask.status === 'pending' && (
              <Button variant="outline" onClick={() => handleAction('execute')}>
                <Play className="mr-2 h-4 w-4" />
                执行
              </Button>
            )}
            {selectedTask.status === 'failed' && (
              <Button variant="outline" onClick={() => handleAction('retry')}>
                <RotateCw className="mr-2 h-4 w-4" />
                重试
              </Button>
            )}
            {(selectedTask.status === 'pending' || selectedTask.status === 'running') && (
              <Button variant="outline" onClick={() => handleAction('cancel')} className="text-red-600">
                <X className="mr-2 h-4 w-4" />
                取消
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧 */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <TaskProgress
                  status={selectedTask.status}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">航线预览</h3>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">地图预览区域</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧 */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">任务信息</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">任务类型</dt>
                    <dd>{TASK_TYPE_LABELS[selectedTask.type]}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">任务状态</dt>
                    <dd>{TASK_STATUS_LABELS[selectedTask.status]}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">优先级</dt>
                    <dd>{TASK_PRIORITY_LABELS[selectedTask.priority]}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">所属无人机</dt>
                    <dd>{selectedTask.droneName || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">航线</dt>
                    <dd>{selectedTask.routeName || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">创建时间</dt>
                    <dd>{new Date(selectedTask.createdAt).toLocaleString('zh-CN')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">创建人</dt>
                    <dd>{selectedTask.creator}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">执行人</dt>
                    <dd>{selectedTask.executor || '-'}</dd>
                  </div>
                  {selectedTask.description && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">描述</dt>
                      <dd>{selectedTask.description}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {selectedTask.status === 'running' && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">实时监控</h3>
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">视频流区域</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 底部：日志时间线 */}
        <div className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <TaskLogTimeline logs={taskLogs} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}