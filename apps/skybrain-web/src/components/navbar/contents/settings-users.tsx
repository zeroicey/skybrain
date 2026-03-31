import { Upload, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function UsersNav() {
  const handleImport = () => {
    toast.info('批量导入功能开发中')
  }

  const handleExport = () => {
    toast.info('导出功能开发中')
  }

  const handleAdd = () => {
    // 触发添加用户 - 通过 URL hash 或事件
    window.dispatchEvent(new CustomEvent('open-add-user-dialog'))
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">用户管理</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="h-4 w-4 mr-1" />
          批量导入
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" />
          导出
        </Button>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          添加用户
        </Button>
      </div>
    </div>
  )
}