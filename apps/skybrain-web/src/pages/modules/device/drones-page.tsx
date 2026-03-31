import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Search } from 'lucide-react'
import { useDeviceStore } from '@/stores/device-store'
import { mockDeviceDrones } from '@/data/mock-device-drones'
import { DroneCard } from '@/components/device/drone-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DronesPage() {
  const navigate = useNavigate()
  const { drones, setDrones } = useDeviceStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (drones.length === 0) {
      setDrones(mockDeviceDrones)
    }
  }, [drones.length, setDrones])

  const filteredDrones = drones.filter(drone => {
    const matchesSearch = drone.name.toLowerCase().includes(search.toLowerCase()) ||
      drone.model.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || drone.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const onlineCount = drones.filter(d => d.status === 'online').length

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          添加无人机
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="online">在线</SelectItem>
            <SelectItem value="offline">离线</SelectItem>
            <SelectItem value="flying">飞行中</SelectItem>
            <SelectItem value="charging">充电中</SelectItem>
            <SelectItem value="maintenance">维护中</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索无人机..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDrones.map(drone => (
          <DroneCard
            key={drone.id}
            drone={drone}
            onDetailClick={(id) => navigate(`/devices/drones/${id}`)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>在线: {onlineCount} / 总数: {drones.length}</span>
      </div>
    </div>
  )
}