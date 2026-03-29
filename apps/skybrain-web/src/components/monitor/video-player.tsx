import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Loader2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  streamUrl?: string | null // HLS 流地址
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

    // 如果是 HLS 流
    if (streamUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.loadSource(streamUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.error('HLS 加载错误:', data)
            setHasError(true)
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
              default:
                hls.destroy()
                break
            }
          }
        })

        return () => {
          hls.destroy()
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari 原生支持 HLS
        video.src = streamUrl
      }
    } else {
      // 普通视频文件
      video.src = streamUrl
    }
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

      {hasError && (
        <div className="flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">信号中断</span>
          <span className="text-sm">视频流加载失败</span>
        </div>
      )}

      {!isLoading && !isOffline && !hasError && streamUrl && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
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