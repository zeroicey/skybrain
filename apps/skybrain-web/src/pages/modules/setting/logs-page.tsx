import { useState } from 'react'
import { Download, Trash2, Search } from 'lucide-react'
import { useSettingStore } from '@/stores/setting-store'
import { LogList } from '@/components/setting/log-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Log } from '@/data/mock-settings'

export default function LogsPage() {
  const { logs, setLogs } = useSettingStore()
  const [search, setSearch] = useState('')
  const [operatorFilter, setOperatorFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.operatorName.toLowerCase().includes(search.toLowerCase())
    const matchesOperator = operatorFilter === 'all' || log.operator === operatorFilter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    return matchesSearch && matchesOperator && matchesAction && matchesStatus
  })

  const handleExport = () => {
    toast.success('日志导出成功')
  }

  const handleClear = () => {
    setLogs([])
    toast.success('日志已清空')
  }

  const uniqueOperators = [...new Set(logs.map(l => l.operator))]
  const uniqueActions = [...new Set(logs.map(l => l.action))]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button variant="outline" className="text-red-600" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            清空
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Select value={operatorFilter} onValueChange={setOperatorFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="操作人" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部操作人</SelectItem>
            {uniqueOperators.map(op => (
              <SelectItem key={op} value={op}>
                {logs.find(l => l.operator === op)?.operatorName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="操作类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            {uniqueActions.map(act => (
              <SelectItem key={act} value={act}>{act}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="success">成功</SelectItem>
            <SelectItem value="failed">失败</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索日志..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <LogList logs={filteredLogs} onViewDetails={setSelectedLog} />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>共 {filteredLogs.length} 条日志</span>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>日志详情</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="grid gap-3 py-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">操作人</span>
                <span className="col-span-2">{selectedLog.operatorName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">操作类型</span>
                <span className="col-span-2">{selectedLog.action}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">操作内容</span>
                <span className="col-span-2">{selectedLog.target}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">IP地址</span>
                <span className="col-span-2">{selectedLog.ip}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">时间</span>
                <span className="col-span-2">{selectedLog.timestamp}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">状态</span>
                <span className="col-span-2">
                  {selectedLog.status === 'success' ? '成功' : '失败'}
                </span>
              </div>
              {selectedLog.details && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">详情</span>
                  <span className="col-span-2 text-red-500">{selectedLog.details}</span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}