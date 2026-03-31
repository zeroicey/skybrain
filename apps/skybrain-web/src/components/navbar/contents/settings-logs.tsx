import { Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingStore } from '@/stores/setting-store'
import { toast } from 'sonner'

export default function LogsNav() {
  const { setLogs } = useSettingStore()

  const handleExport = () => {
    toast.info('日志导出功能开发中')
  }

  const handleClear = () => {
    setLogs([])
    toast.success('日志已清空')
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">操作日志</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" />
          导出
        </Button>
        <Button variant="outline" size="sm" className="text-red-600" onClick={handleClear}>
          <Trash2 className="h-4 w-4 mr-1" />
          清空
        </Button>
      </div>
    </div>
  )
}