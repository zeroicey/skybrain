import { cn } from '@/lib/utils'
import type { Drone } from '@/types/drone'
import { VideoCard } from './video-card'

interface VideoGridProps {
  drones: Drone[]
  onFullscreen?: (drone: Drone) => void
  videoMap?: Map<string, string>
  mjpgMap?: Map<string, boolean>
  className?: string
}

export function VideoGrid({ drones, onFullscreen, videoMap, mjpgMap, className }: VideoGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
      className
    )}>
      {drones.map((drone) => (
        <VideoCard
          key={drone.id}
          drone={drone}
          onFullscreen={onFullscreen}
          streamUrl={videoMap?.get(drone.id)}
          isMjpg={mjpgMap?.get(drone.id) ?? drone.isMjpg}
        />
      ))}
    </div>
  )
}