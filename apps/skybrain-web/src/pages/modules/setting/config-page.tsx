import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { useSettingStore } from '@/stores/setting-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export default function ConfigPage() {
  const { config, updateConfig } = useSettingStore()
  const [localConfig, setLocalConfig] = useState(config)
  const [activeTab, setActiveTab] = useState('basic')

  const handleSave = () => {
    updateConfig(localConfig)
    toast.success('配置已保存')
  }

  const handleReset = () => {
    setLocalConfig(config)
    toast.info('已恢复为保存的配置')
  }

  const weatherOptions = ['大风', '暴雨', '雷电', '大雪', '大雾']

  const toggleWeather = (weather: string) => {
    const current = localConfig.noFlyWeather || []
    const newWeather = current.includes(weather)
      ? current.filter(w => w !== weather)
      : [...current, weather]
    setLocalConfig({ ...localConfig, noFlyWeather: newWeather })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">系统配置</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            恢复默认
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存配置
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">基础配置</TabsTrigger>
          <TabsTrigger value="flight">飞行配置</TabsTrigger>
          <TabsTrigger value="alert">告警配置</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <div className="grid gap-4 max-w-2xl">
            <div className="grid gap-2">
              <Label htmlFor="systemName">系统名称</Label>
              <Input
                id="systemName"
                value={localConfig.systemName}
                onChange={(e) => setLocalConfig({ ...localConfig, systemName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="systemDescription">系统描述</Label>
              <Input
                id="systemDescription"
                value={localConfig.systemDescription}
                onChange={(e) => setLocalConfig({ ...localConfig, systemDescription: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataRetentionDays">数据保留天数</Label>
                <Input
                  id="dataRetentionDays"
                  type="number"
                  value={localConfig.dataRetentionDays}
                  onChange={(e) => setLocalConfig({ ...localConfig, dataRetentionDays: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">时区</Label>
                <Input
                  id="timezone"
                  value={localConfig.timezone}
                  onChange={(e) => setLocalConfig({ ...localConfig, timezone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">语言</Label>
              <Input
                id="language"
                value={localConfig.language}
                onChange={(e) => setLocalConfig({ ...localConfig, language: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="flight" className="space-y-4 mt-6">
          <div className="grid gap-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minFlightAltitude">最低飞行高度 (米)</Label>
                <Input
                  id="minFlightAltitude"
                  type="number"
                  value={localConfig.minFlightAltitude}
                  onChange={(e) => setLocalConfig({ ...localConfig, minFlightAltitude: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxFlightAltitude">最高飞行高度 (米)</Label>
                <Input
                  id="maxFlightAltitude"
                  type="number"
                  value={localConfig.maxFlightAltitude}
                  onChange={(e) => setLocalConfig({ ...localConfig, maxFlightAltitude: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="returnHomeBatteryThreshold">返航电量阈值 (%)</Label>
              <Input
                id="returnHomeBatteryThreshold"
                type="number"
                value={localConfig.returnHomeBatteryThreshold}
                onChange={(e) => setLocalConfig({ ...localConfig, returnHomeBatteryThreshold: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>禁飞天气</Label>
              <div className="flex gap-4">
                {weatherOptions.map((weather) => (
                  <div key={weather} className="flex items-center gap-2">
                    <Checkbox
                      id={weather}
                      checked={localConfig.noFlyWeather?.includes(weather)}
                      onCheckedChange={() => toggleWeather(weather)}
                    />
                    <Label htmlFor={weather} className="font-normal">{weather}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alert" className="space-y-4 mt-6">
          <div className="grid gap-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="grid gap-2">
                <Label htmlFor="alertEnabled">启用告警通知</Label>
                <p className="text-sm text-muted-foreground">开启后将推送告警通知到指定渠道</p>
              </div>
              <Switch
                id="alertEnabled"
                checked={localConfig.alertEnabled}
                onCheckedChange={(checked) => setLocalConfig({ ...localConfig, alertEnabled: checked })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alertEmail">告警邮箱</Label>
              <Input
                id="alertEmail"
                type="email"
                value={localConfig.alertEmail}
                onChange={(e) => setLocalConfig({ ...localConfig, alertEmail: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alertPhone">告警手机</Label>
              <Input
                id="alertPhone"
                value={localConfig.alertPhone}
                onChange={(e) => setLocalConfig({ ...localConfig, alertPhone: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}