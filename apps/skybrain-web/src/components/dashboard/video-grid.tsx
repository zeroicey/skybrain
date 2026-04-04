import { Drone, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Drone as DroneType } from '@/types/drone'

interface VideoGridProps {
  drones: DroneType[]
  videoMap?: Map<string, string>
  isLoading?: boolean
  onVideoClick?: (drone: DroneType) => void
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'offline':
      return 'bg-red-500'
    default:
      return 'bg-zinc-500'
  }
}

export function VideoGrid({ drones, videoMap, isLoading, onVideoClick }: VideoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {drones.map(drone => {
        const streamUrl = videoMap?.get(drone.id)

        return (
          <Card
            key={drone.id}
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors"
            onClick={() => onVideoClick?.(drone)}
          >
            <CardContent className="p-0">
              {/* 视频区域 */}
              <div className="aspect-video bg-zinc-800 flex items-center justify-center relative">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                ) : streamUrl ? (
                  drone.isMjpg ? (
                    <img
                      src={streamUrl}
                      alt={drone.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={streamUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )
                ) : (
                  <Drone className="h-12 w-12 text-zinc-600" />
                )}
                {/* 状态指示点 */}
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${getStatusColor(drone.status)}`} />
              </div>
              {/* 底部信息 */}
              <div className="p-3 flex justify-between items-center">
                <div className="text-sm font-medium">{drone.name}</div>
                <div className="text-xs text-zinc-400">
                  🔋 {drone.battery}%
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}