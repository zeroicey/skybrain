import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TaskType, TaskStatus } from "@/types/task"
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS } from "@/types/task"
import { Search, X } from "lucide-react"

interface TaskFiltersProps {
  filters: {
    type?: TaskType
    status?: TaskStatus
    search?: string
  }
  onFilterChange: (filters: Partial<{
    type: TaskType | undefined
    status: TaskStatus | undefined
    search: string | undefined
  }>) => void
  onReset: () => void
}

export function TaskFilters({ filters, onFilterChange, onReset }: TaskFiltersProps) {
  const hasFilters = filters.type || filters.status || filters.search

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <Select
        value={filters.type || "all"}
        onValueChange={(value) => onFilterChange({ type: value === "all" ? undefined : value as TaskType })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="任务类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部类型</SelectItem>
          {Object.entries(TASK_TYPE_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || "all"}
        onValueChange={(value) => onFilterChange({ status: value === "all" ? undefined : value as TaskStatus })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="任务状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex-1 max-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索任务名称..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
          className="pl-9"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-auto p-1"
            onClick={() => onFilterChange({ search: undefined })}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={onReset}>
          重置
        </Button>
      )}
    </div>
  )
}