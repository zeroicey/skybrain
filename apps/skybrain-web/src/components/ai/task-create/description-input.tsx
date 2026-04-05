import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface DescriptionInputProps {
  value: string
  onChange: (v: string) => void
  onParse: () => void
  maxLength?: number
  disabled?: boolean
  isLoading?: boolean
}

export function DescriptionInput({
  value,
  onChange,
  onParse,
  maxLength = 500,
  disabled,
  isLoading,
}: DescriptionInputProps) {
  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例如：让2号无人机今天下午3点去教学楼A进行日常巡检..."
        disabled={disabled}
        className="min-h-[120px]"
        maxLength={maxLength}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </span>
        <Button onClick={onParse} disabled={disabled || isLoading || !value.trim()}>
          <Sparkles className="h-4 w-4 mr-2" />
          智能解析
        </Button>
      </div>
    </div>
  )
}