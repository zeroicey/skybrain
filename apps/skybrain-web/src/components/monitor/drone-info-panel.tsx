import { MapPin, Gauge, Battery } from 'lucide-react'
import type { Drone } from '@/types/drone'
import { cn } from '@/lib/utils'

interface DroneInfoPanelProps {
  drone?: Drone
  speed?: number
  location?: string
}

const batteryColors = {
  high: 'text-green-500',
  medium: 'text-yellow-500',
  low: 'text-red-500',
}

function getBatteryColor(battery: number): 'high' | 'medium' | 'low' {
  if (battery > 60) return 'high'
  if (battery > 30) return 'medium'
  return 'low'
}

export function DroneInfoPanel({
  drone,
  speed = 0,
  location = '未知',
}: DroneInfoPanelProps) {
  if (!drone) {
    return (
      <div className="flex items-center gap-6 p-3 bg-muted/30 rounded-lg text-muted-foreground">
        <span className="text-sm">未选择无人机</span>
      </div>
    )
  }

  const batteryLevel = getBatteryColor(drone.battery)

  return (
    <div className="flex items-center gap-6 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{drone.altitude}m</span>
        <span className="text-xs text-muted-foreground">高度</span>
      </div>

      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{speed}m/s</span>
        <span className="text-xs text-muted-foreground">速度</span>
      </div>

      <div className="flex items-center gap-2">
        <Battery className={cn('h-4 w-4', batteryColors[batteryLevel])} />
        <span className={cn('text-sm font-medium', batteryColors[batteryLevel])}>
          {drone.battery}%
        </span>
        <span className="text-xs text-muted-foreground">电池</span>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{location}</span>
        <span className="text-xs text-muted-foreground">位置</span>
      </div>
    </div>
  )
}