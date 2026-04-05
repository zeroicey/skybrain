import { Mic, Loader2 } from 'lucide-react'

interface VoiceStatusIndicatorProps {
  status: 'idle' | 'listening' | 'processing'
  label?: string
}

export function VoiceStatusIndicator({ status, label }: VoiceStatusIndicatorProps) {
  const statusConfig = {
    idle: { icon: Mic, text: '点击开始语音', color: 'text-muted-foreground' },
    listening: { icon: Mic, text: '正在录音...', color: 'text-destructive animate-pulse' },
    processing: { icon: Loader2, text: '处理中...', color: 'text-primary animate-spin' },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 ${config.color}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label || config.text}</span>
    </div>
  )
}