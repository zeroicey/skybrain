import { useNavigate } from "react-router"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Task } from "@/types/task"
import { TASK_STATUS_LABELS, TASK_TYPE_LABELS, TASK_PRIORITY_LABELS } from "@/types/task"

interface TaskTableProps {
  tasks: Task[]
  onDelete: (id: string) => void
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  running: "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  cancelled: "bg-gray-500"
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

export function TaskTable({ tasks, onDelete }: TaskTableProps) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>任务名称</TableHead>
          <TableHead>类型</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>优先级</TableHead>
          <TableHead>无人机</TableHead>
          <TableHead>执行人</TableHead>
          <TableHead className="w-[80px]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task, index) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium">{task.name}</TableCell>
            <TableCell>{TASK_TYPE_LABELS[task.type]}</TableCell>
            <TableCell>
              <Badge className={statusColors[task.status]}>
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.priority]}`}>
                {TASK_PRIORITY_LABELS[task.priority]}
              </span>
            </TableCell>
            <TableCell>{task.droneName || '-'}</TableCell>
            <TableCell>{task.executor || task.creator}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/tasks/${task.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    查看详情
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}