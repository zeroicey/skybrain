import { Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingStore } from '@/stores/setting-store'
import { defaultConfig } from '@/data/mock-settings'
import { toast } from 'sonner'

export default function ConfigNav() {
  const { updateConfig } = useSettingStore()

  const handleSave = () => {
    // 保存当前配置到 store
    // localConfig 的值已经在页面中更新到 store 了
    toast.success('配置已保存')
  }

  const handleReset = () => {
    // 恢复默认配置
    updateConfig(defaultConfig)
    toast.info('已恢复为默认配置')
    // 刷新页面以重新加载
    window.location.reload()
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">系统配置</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          恢复默认
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          保存配置
        </Button>
      </div>
    </div>
  )
}