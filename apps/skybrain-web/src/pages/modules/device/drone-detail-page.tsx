import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Battery, MapPin, Settings } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { useDeviceStore } from '@/stores/device-store'
import { mockDeviceDrones } from '@/data/mock-device-drones'
import { Model } from '@/components/landing/model'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DroneDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { drones, setDrones } = useDeviceStore()

  useEffect(() => {
    if (drones.length === 0) {
      setDrones(mockDeviceDrones)
    }
  }, [drones.length, setDrones])

  const drone = drones.find(d => d.id === id)

  if (!drone) {
    return (
      <div className="container mx-auto p-6">
        <p>无人机不存在</p>
        <Button onClick={() => navigate('/devices/drones')}>返回列表</Button>
      </div>
    )
  }

  const statusMap = {
    online: { label: '在线', variant: 'default' as const },
    offline: { label: '离线', variant: 'secondary' as const },
    flying: { label: '飞行中', variant: 'default' as const },
    charging: { label: '充电中', variant: 'outline' as const },
    maintenance: { label: '维护中', variant: 'destructive' as const }
  }

  const statusInfo = statusMap[drone.status]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/devices/drones')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {drone.name}
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </h1>
        <Button variant="outline" className="ml-auto">
          <Settings className="h-4 w-4 mr-2" />
          更多操作
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>3D 模型展示</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Model scale={5} rotation={[0.2, 0, 0.1]} />
              </Canvas>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>无人机信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">型号</span>
                <span>{drone.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">序列号</span>
                <span>{drone.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">固件版本</span>
                <span>{drone.firmwareVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">累计飞行</span>
                <span>{drone.totalFlightTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">累计起降</span>
                <span>{drone.totalFlights}次</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">上次维护</span>
                <span>{drone.lastMaintenance}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>实时状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                <span>电池: {drone.battery}%</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${drone.battery}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>位置: {drone.location}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
