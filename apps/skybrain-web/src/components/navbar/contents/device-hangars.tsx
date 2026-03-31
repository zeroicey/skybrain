import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function HangarsNav() {
  const handleAdd = () => {
    toast.info('添加机库功能开发中')
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">机库管理</span>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          添加机库
        </Button>
      </div>
    </div>
  )
}