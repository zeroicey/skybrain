import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function MaintenanceNav() {
  const handleExport = () => {
    toast.info('导出功能开发中')
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">维护记录</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" />
          导出
        </Button>
      </div>
    </div>
  )
}