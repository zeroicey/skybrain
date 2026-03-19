import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Drone } from '@/types/drone'

interface QuickAddDropdownProps {
  availableDrones: Drone[]
  onAdd: (drone: Drone) => void
}

export function QuickAddDropdown({ availableDrones, onAdd }: QuickAddDropdownProps) {
  const offlineDrones = availableDrones.filter(d => d.status === 'offline')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          快速添加
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {offlineDrones.length === 0 ? (
          <DropdownMenuItem disabled>暂无可用无人机</DropdownMenuItem>
        ) : (
          offlineDrones.map((drone) => (
            <DropdownMenuItem
              key={drone.id}
              onClick={() => onAdd(drone)}
            >
              {drone.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}