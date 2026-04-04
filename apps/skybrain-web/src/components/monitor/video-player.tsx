import { useEffect, useState } from 'react'
import { Loader2, Video, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  streamUrl?: string | null
  isLoading?: boolean
  isOffline?: boolean
  isMjpg?: boolean      // 是否为 MJPEG 实时流
  className?: string
}

export function VideoPlayer({
  streamUrl,
  isLoading = false,
  isOffline = false,
  isMjpg = false,
  className
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false)

  // 当链接发生变化时，重置错误状态
  useEffect(() => {
    setHasError(false)
  }, [streamUrl])

  // 计算当前应该显示哪种状态，使代码更易读
  const showLoading = isLoading
  const showOffline = isOffline && !isLoading
  const showError = hasError && !isLoading && !isOffline
  const showWait = !streamUrl && !isLoading && !isOffline && !hasError

  return (
    <div className={cn(
      'relative bg-black rounded-lg overflow-hidden flex items-center justify-center aspect-video',
      className
    )}>
      {/* --- 状态提示层 (浮在视频上方) --- */}
      {showLoading && (
        <div className="absolute z-10 flex flex-col items-center gap-3 text-white/70">
          <Loader2 className="h-16 w-16 animate-spin" />
          <span className="text-lg">视频加载中...</span>
        </div>
      )}

      {showOffline && (
        <div className="absolute z-10 flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">离线</span>
        </div>
      )}

      {showError && (
        <div className="absolute z-10 flex flex-col items-center gap-3 text-red-500/70">
          <AlertCircle className="h-16 w-16" />
          <span className="text-lg">加载失败 (可能是编码不支持)</span>
        </div>
      )}

      {showWait && (
        <div className="absolute z-10 flex flex-col items-center gap-3 text-white/50">
          <Video className="h-16 w-16" />
          <span className="text-lg">等待信号</span>
        </div>
      )}

      {/* --- 视频播放层 --- */}
      {streamUrl && (
        isMjpg ? (
          // MJPEG 实时流使用 img 标签
          <img
            src={streamUrl}
            alt="实时视频流"
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              (showLoading || showOffline || showError) ? "opacity-0" : "opacity-100"
            )}
            onError={() => setHasError(true)}
            onLoad={() => setHasError(false)}
          />
        ) : (
          // 普通视频使用 video 标签
          <video
            src={streamUrl}
            // 出错或加载时，将视频完全透明，但不销毁 DOM 节点
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              (showLoading || showOffline || showError) ? "opacity-0" : "opacity-100"
            )}
            autoPlay
            muted
            playsInline
            loop
            // 直接使用 React 原生事件，省去 useEffect 的烦恼
            onError={(e) => {
              console.error('视频底层报错代码:', e.currentTarget.error?.code)
              setHasError(true)
            }}
            onLoadedData={() => setHasError(false)}
          />
        )
      )}
    </div>
  )
}
