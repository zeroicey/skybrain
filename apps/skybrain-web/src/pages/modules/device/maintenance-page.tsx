import { useEffect, useState } from 'react'
import { Plus, Search, Download } from 'lucide-react'
import { useDeviceStore } from '@/stores/device-store'
import { mockDeviceMaintenance } from '@/data/mock-device-maintenance'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function MaintenancePage() {
  const { maintenanceRecords, setMaintenanceRecords } = useDeviceStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all')

  useEffect(() => {
    if (maintenanceRecords.length === 0) {
      setMaintenanceRecords(mockDeviceMaintenance)
    }
  }, [maintenanceRecords.length, setMaintenanceRecords])

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      record.executor.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || record.type === typeFilter
    const matchesDeviceType = deviceTypeFilter === 'all' || record.deviceType === deviceTypeFilter
    return matchesSearch && matchesType && matchesDeviceType
  })

  const typeMap = {
    routine: '例行维护',
    repair: '维修',
    inspection: '检查',
    upgrade: '升级'
  }

  const statusMap = {
    pending: { label: '待处理', variant: 'secondary' as const },
    in_progress: { label: '进行中', variant: 'default' as const },
    completed: { label: '已完成', variant: 'outline' as const }
  }

  const deviceTypeMap = {
    drone: '无人机',
    hangar: '机库',
    battery: '电池',
    camera: '摄像头'
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">维护记录</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            添加记录
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="设备类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="drone">无人机</SelectItem>
            <SelectItem value="hangar">机库</SelectItem>
            <SelectItem value="battery">电池</SelectItem>
            <SelectItem value="camera">摄像头</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="维护类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="routine">例行维护</SelectItem>
            <SelectItem value="repair">维修</SelectItem>
            <SelectItem value="inspection">检查</SelectItem>
            <SelectItem value="upgrade">升级</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>设备</TableHead>
              <TableHead>设备类型</TableHead>
              <TableHead>维护类型</TableHead>
              <TableHead>执行人</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => {
              const statusInfo = statusMap[record.status]
              return (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.deviceName}</TableCell>
                  <TableCell>{deviceTypeMap[record.deviceType]}</TableCell>
                  <TableCell>{typeMap[record.type]}</TableCell>
                  <TableCell>{record.executor}</TableCell>
                  <TableCell>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {record.notes || '-'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}