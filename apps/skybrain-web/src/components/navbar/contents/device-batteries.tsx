import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function BatteriesNav() {
  const handleAdd = () => {
    toast.info('添加电池功能开发中')
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">电池管理</span>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          添加电池
        </Button>
      </div>
    </div>
  )
}