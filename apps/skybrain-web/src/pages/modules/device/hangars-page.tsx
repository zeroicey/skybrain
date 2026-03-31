import { useEffect } from 'react'
import { Thermometer, Droplets } from 'lucide-react'
import { useDeviceStore } from '@/stores/device-store'
import { mockDeviceHangars } from '@/data/mock-device-hangars'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HangarsPage() {
  const { hangars, setHangars } = useDeviceStore()

  useEffect(() => {
    if (hangars.length === 0) {
      setHangars(mockDeviceHangars)
    }
  }, [hangars.length, setHangars])

  const statusMap = {
    normal: { label: '正常', variant: 'default' as const },
    error: { label: '异常', variant: 'destructive' as const },
    maintenance: { label: '维护中', variant: 'outline' as const }
  }

  const slotStatusMap = {
    empty: { label: '空', variant: 'secondary' as const },
    charging: { label: '充电中', variant: 'default' as const },
    standby: { label: '待机', variant: 'outline' as const }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hangars.map(hangar => {
          const statusInfo = statusMap[hangar.status]
          return (
            <Card key={hangar.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{hangar.name}</CardTitle>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{hangar.location}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span>温度: {hangar.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    <span>湿度: {hangar.humidity}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {hangar.droneSlots.map(slot => {
                    const slotStatus = slotStatusMap[slot.status]
                    return (
                      <div
                        key={slot.id}
                        className={`p-2 rounded border text-sm ${
                          slot.status === 'empty' ? 'bg-muted' : 'bg-background'
                        }`}
                      >
                        <div className="font-medium">
                          {slot.droneName || '空仓位'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {slot.status === 'empty' ? (
                            '空'
                          ) : (
                            <>
                              <Badge variant={slotStatus.variant} className="text-xs">
                                {slotStatus.label}
                              </Badge>
                              {slot.battery !== undefined && ` | ${slot.battery}%`}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">开门</Button>
                  <Button variant="outline" size="sm">关舱门</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}