import { Loader2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  isLoading?: boolean
  isOffline?: boolean
  className?: string
}

export function VideoPlayer({
  isLoading = false,
  isOffline = false,
  className
}: VideoPlayerProps) {
  return (
    <div className={cn(
      'relative bg-black rounded-lg overflow-hidden flex items-center justify-center',
      'aspect-video',
      className
    )}>
      {isLoading && (
        <div className="flex flex-col items-center gap-3 text-white/70">
          <Loader2 className="h-16 w-16 animate-spin" />
          <span className="text-lg">视频流加载中...</span>
          <span className="text-sm text-white/50">正在连接无人机图传信号</span>
        </div>
      )}

      {isOffline && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">离线</span>
          <span className="text-sm">无人机已离线，无法接收视频信号</span>
        </div>
      )}

      {!isLoading && !isOffline && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">等待信号</span>
        </div>
      )}
    </div>
  )
}