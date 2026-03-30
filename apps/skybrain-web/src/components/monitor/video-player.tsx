import { useEffect, useRef, useState } from 'react'
import { Loader2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  streamUrl?: string | null // 视频文件 URL
  isLoading?: boolean
  isOffline?: boolean
  className?: string
}

export function VideoPlayer({
  streamUrl,
  isLoading = false,
  isOffline = false,
  className
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!streamUrl || !videoRef.current) {
      return
    }

    setHasError(false)
    const video = videoRef.current

    // 直接设置视频源，支持流式播放
    video.src = streamUrl
    video.load()

    video.addEventListener('error', () => {
      console.error('视频加载错误')
      setHasError(true)
    })

    video.addEventListener('loadeddata', () => {
      setHasError(false)
    })
  }, [streamUrl])

  return (
    <div className={cn(
      'relative bg-black rounded-lg overflow-hidden flex items-center justify-center',
      'aspect-video',
      className
    )}>
      {isLoading && (
        <div className="flex flex-col items-center gap-3 text-white/70">
          <Loader2 className="h-16 w-16 animate-spin" />
          <span className="text-lg">视频加载中...</span>
        </div>
      )}

      {isOffline && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">离线</span>
        </div>
      )}

      {hasError && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">加载失败</span>
        </div>
      )}

      {!isLoading && !isOffline && !hasError && streamUrl && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          controls
        />
      )}

      {!streamUrl && !isLoading && !isOffline && !hasError && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">等待信号</span>
        </div>
      )}
    </div>
  )
}