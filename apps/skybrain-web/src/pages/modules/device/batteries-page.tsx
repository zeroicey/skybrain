import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useDeviceStore } from '@/stores/device-store'
import { mockDeviceBatteries } from '@/data/mock-device-batteries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function BatteriesPage() {
  const { batteries, setBatteries } = useDeviceStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (batteries.length === 0) {
      setBatteries(mockDeviceBatteries)
    }
  }, [batteries.length, setBatteries])

  const filteredBatteries = batteries.filter(battery => {
    const matchesSearch = battery.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      battery.model.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || battery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: batteries.length,
    charging: batteries.filter(b => b.status === 'charging').length,
    idle: batteries.filter(b => b.status === 'idle').length,
    maintenance: batteries.filter(b => b.status === 'maintenance').length
  }

  const statusMap = {
    charging: { label: '充电中', variant: 'default' as const },
    discharging: { label: '放电中', variant: 'secondary' as const },
    idle: { label: '空闲', variant: 'outline' as const },
    maintenance: { label: '维护中', variant: 'destructive' as const }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">电池管理</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          添加电池
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">总电池</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.charging}</div>
            <div className="text-sm text-muted-foreground">充电中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.idle}</div>
            <div className="text-sm text-muted-foreground">空闲</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.maintenance}</div>
            <div className="text-sm text-muted-foreground">需要维护</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="charging">充电中</SelectItem>
            <SelectItem value="idle">空闲</SelectItem>
            <SelectItem value="maintenance">维护中</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索电池..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatteries.map(battery => {
          const statusInfo = statusMap[battery.status]
          return (
            <Card key={battery.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{battery.serialNumber}</CardTitle>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-muted-foreground">{battery.model}</div>
                <div className="flex justify-between">
                  <span>电量</span>
                  <span>{battery.电量}%</span>
                </div>
                <div className="flex justify-between">
                  <span>循环次数</span>
                  <span>{battery.cycleCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>健康度</span>
                  <span>{battery.health}%</span>
                </div>
                {battery.associatedDroneName && (
                  <div className="text-muted-foreground">
                    所属: {battery.associatedDroneName}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}