import { Battery, MapPin, Maximize2, Video, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Drone } from '@/types/drone'

interface VideoCardProps {
  drone: Drone
  onFullscreen?: (drone: Drone) => void
  className?: string
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  warning: 'bg-yellow-500',
}

export function VideoCard({ drone, onFullscreen, className }: VideoCardProps) {
  return (
    <div className={cn('relative rounded-lg overflow-hidden border bg-card group', className)}>
      {/* 视频区域 */}
      <div className="aspect-video bg-muted flex items-center justify-center relative">
        {drone.status !== 'offline' ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin" />
            <span className="text-sm">视频流加载中...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <Video className="h-12 w-12" />
            <span className="text-sm">离线</span>
          </div>
        )}

        {/* 全屏按钮 - 右下角 */}
        {drone.status !== 'offline' && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
            onClick={() => onFullscreen?.(drone)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}

        {/* 顶部信息栏 - 浮动 */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', statusColors[drone.status])} />
            <span className="text-xs text-foreground/80 font-medium">{drone.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-foreground/70 bg-background/80 px-2 py-1 rounded">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {drone.altitude}m
            </span>
            <span className="flex items-center gap-1">
              <Battery className={cn(
                'h-3 w-3',
                drone.battery > 60 ? 'text-green-500' :
                drone.battery > 30 ? 'text-yellow-500' : 'text-red-500'
              )} />
              {drone.battery}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}