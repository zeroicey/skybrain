import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DronesNav() {
  const handleAdd = () => {
    window.dispatchEvent(new CustomEvent('open-add-drone-dialog'))
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">无人机列表</span>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          添加无人机
        </Button>
      </div>
    </div>
  )
}