import { Mic } from 'lucide-react'

interface RecordingIndicatorProps {
  isRecording: boolean
  duration?: number
}

export function RecordingIndicator({ isRecording, duration = 0 }: RecordingIndicatorProps) {
  if (!isRecording) return null

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2 text-destructive">
      <Mic className="h-4 w-4 animate-pulse" />
      <span className="text-sm font-medium">录音中 {formatDuration(duration)}</span>
    </div>
  )
}