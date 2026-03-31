import { Drone, Battery, Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DeviceDrone } from '@/types/drone'

interface DroneCardProps {
  drone: DeviceDrone
  onDetailClick: (id: string) => void
}

const statusMap = {
  online: { label: '在线', variant: 'default' as const },
  offline: { label: '离线', variant: 'secondary' as const },
  flying: { label: '飞行中', variant: 'default' as const },
  charging: { label: '充电中', variant: 'outline' as const },
  maintenance: { label: '维护中', variant: 'destructive' as const }
}

export function DroneCard({ drone, onDetailClick }: DroneCardProps) {
  const statusInfo = statusMap[drone.status]

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Drone className="h-5 w-5" />
            {drone.name}
          </CardTitle>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{drone.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Battery className="h-4 w-4" />
          <span>电池: {drone.battery}%</span>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${drone.battery}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>累计飞行: {drone.totalFlightTime}h</span>
        </div>
        <div className="text-xs text-muted-foreground">
          型号: {drone.model}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onDetailClick(drone.id)}
        >
          详情
        </Button>
      </CardFooter>
    </Card>
  )
}