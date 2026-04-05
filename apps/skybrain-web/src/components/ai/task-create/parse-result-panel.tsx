import type { ParsedTask } from '@/types/ai'
import { ParsedField } from './parsed-field'
import { SuggestedRoute } from './suggested-route'

interface ParseResultPanelProps {
  result: ParsedTask
  onEdit?: (field: keyof ParsedTask, value: string) => void
}

export function ParseResultPanel({ result, onEdit }: ParseResultPanelProps) {
  return (
    <div className="space-y-3">
      <ParsedField label="任务类型" value={result.taskTypeLabel || result.taskType || ''} confidence={result.confidence} />
      <ParsedField label="无人机" value={result.droneName || ''} confidence={result.confidence} />
      <ParsedField label="执行时间" value={result.executeTime || ''} confidence={result.confidence} />
      <ParsedField label="执行地点" value={result.location || ''} confidence={result.confidence} />
      <ParsedField label="任务描述" value={result.description || ''} confidence={result.confidence} />

      {result.routeName && (
        <SuggestedRoute
          routeName={result.routeName}
          onSelect={(routeId) => onEdit?.('routeId', routeId)}
        />
      )}

      <div className="pt-2 border-t">
        <span className="text-xs text-muted-foreground">
          解析置信度: {Math.round(result.confidence * 100)}%
        </span>
      </div>
    </div>
  )
}