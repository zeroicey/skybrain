import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { ScheduledTask } from "@/types/task"

interface ScheduleListProps {
  scheduledTasks: ScheduledTask[]
  onToggle: (id: string) => void
  onEdit: (task: ScheduledTask) => void
  onDelete: (id: string) => void
}

const scheduleTypeLabels: Record<string, string> = {
  once: '一次性',
  daily: '每日',
  weekly: '每周',
  custom: '自定义'
}

export function ScheduleList({ scheduledTasks, onToggle, onEdit, onDelete }: ScheduleListProps) {
  const getDayNames = (dayOfWeek?: number[]) => {
    if (!dayOfWeek) return '-'
    return dayOfWeek.map(d => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][d]).join(', ')
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>任务名称</TableHead>
          <TableHead>定时类型</TableHead>
          <TableHead>执行时间</TableHead>
          <TableHead>重复日期</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className="w-[120px]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduledTasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.taskName}</TableCell>
            <TableCell>{scheduleTypeLabels[task.scheduleType]}</TableCell>
            <TableCell>{task.time}</TableCell>
            <TableCell>{getDayNames(task.dayOfWeek)}</TableCell>
            <TableCell>
              <Switch
                checked={task.enabled}
                onCheckedChange={() => onToggle(task.id)}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {scheduledTasks.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              暂无定时任务
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}