import { Slider } from '@/components/ui/slider'
import type { VideoRecord } from '@/types/drone'

interface VideoTimelineProps {
  records?: VideoRecord[]
  currentTime?: number
  onSeek?: (time: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function VideoTimeline({
  records = [],
  currentTime = 0,
  onSeek,
}: VideoTimelineProps) {
  const totalDuration = records.length > 0 ? records[0].duration : 3600

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>录像时间轴</span>
        <span>{formatTime(totalDuration)}</span>
      </div>
      <Slider
        value={[currentTime]}
        onValueChange={(value) => onSeek?.(value[0])}
        max={totalDuration}
        step={1}
        className="cursor-pointer"
      />
    </div>
  )
}