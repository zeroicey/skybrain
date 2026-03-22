import { Video } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockDrones } from '@/data/mock-drones'
import type { DroneStatus } from '@/types/drone'

interface DroneSelectorProps {
  value?: string
  onChange: (droneId: string) => void
  placeholder?: string
  excludeOffline?: boolean
}

const statusColors: Record<DroneStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  warning: 'bg-yellow-500',
}

export function DroneSelector({
  value,
  onChange,
  placeholder = '选择无人机',
  excludeOffline = true
}: DroneSelectorProps) {
  const drones = excludeOffline
    ? mockDrones.filter(d => d.status !== 'offline')
    : mockDrones

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <Video className="mr-2 h-4 w-4" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {drones.map((drone) => (
          <SelectItem key={drone.id} value={drone.id}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[drone.status]}`} />
              <span>{drone.name}</span>
              <span className="text-muted-foreground text-xs">🔋{drone.battery}%</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}