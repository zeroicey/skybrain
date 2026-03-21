import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import type { Task, TaskType, TaskPriority, RepeatType } from "@/types/task"
import { TASK_TYPE_LABELS, TASK_PRIORITY_LABELS } from "@/types/task"
import { mockRoutes } from "@/data/mock-tasks"
import { mockDrones } from "@/data/mock-drones"

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void
  initialData?: Task
  isEdit?: boolean
}

export function TaskForm({ onSubmit, initialData }: TaskFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'patrol' as TaskType,
    priority: initialData?.priority || 'normal' as TaskPriority,
    description: initialData?.description || '',
    routeId: initialData?.routeId || '',
    routeName: initialData?.routeName || '',
    droneId: initialData?.droneId || '',
    droneName: initialData?.droneName || '',
    executeTime: initialData?.executeTime || '',
    repeat: initialData?.repeat || 'none' as RepeatType,
    realTimeAnalysis: initialData?.aiSettings?.realTimeAnalysis ?? true,
    autoAlert: initialData?.aiSettings?.autoAlert ?? true,
    notifyPhone: initialData?.aiSettings?.notifyMethods?.includes('phone') ?? false,
    notifyEmail: initialData?.aiSettings?.notifyMethods?.includes('email') ?? false,
  })

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    const task = {
      name: formData.name,
      type: formData.type,
      priority: formData.priority,
      description: formData.description,
      routeId: formData.routeId,
      routeName: formData.routeName,
      droneId: formData.droneId || undefined,
      droneName: formData.droneName || undefined,
      executeTime: formData.executeTime || undefined,
      repeat: formData.repeat,
      creator: initialData?.creator || '当前用户',
      executor: initialData?.executor,
      status: initialData?.status || 'pending',
      aiSettings: {
        realTimeAnalysis: formData.realTimeAnalysis,
        autoAlert: formData.autoAlert,
        notifyMethods: [
          ...(formData.notifyPhone ? ['phone'] as const : []),
          ...(formData.notifyEmail ? ['email'] as const : [])
        ]
      }
    }
    onSubmit(task)
  }

  const selectedRoute = mockRoutes.find(r => r.id === formData.routeId)
  const selectedDrone = mockDrones.find(d => d.id === formData.droneId)

  return (
    <div className="space-y-6">
      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              {s}
            </div>
            {s < totalSteps && (
              <div className={`w-16 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* 步骤标签 */}
      <div className="flex justify-center gap-8 text-sm text-muted-foreground">
        <span>基本信息</span>
        <span>航线选择</span>
        <span>参数设置</span>
        <span>确认提交</span>
      </div>

      {/* 步骤内容 */}
      <Card>
        <CardContent className="pt-6">
          {/* 步骤1: 基本信息 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">任务名称</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入任务名称"
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label>任务类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as TaskType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TASK_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label>优先级</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                  className="flex gap-4"
                >
                  {Object.entries(TASK_PRIORITY_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">任务描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入任务描述"
                />
              </div>
            </div>
          )}

          {/* 步骤2: 航线选择 */}
          {step === 2 && (
            <div className="space-y-4">
              <Label>选择航线</Label>
              <div className="grid grid-cols-2 gap-4">
                {mockRoutes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.routeId === route.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setFormData({
                      ...formData,
                      routeId: route.id,
                      routeName: route.name
                    })}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.routeId === route.id}
                        onChange={() => {}}
                        className="accent-primary"
                      />
                      <span className="font-medium">{route.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedRoute && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    已选择航线: {selectedRoute.name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 步骤3: 参数设置 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid w-full items-center gap-1.5">
                <Label>选择无人机</Label>
                <Select
                  value={formData.droneId}
                  onValueChange={(value: string) => {
                    const drone = mockDrones.find(d => d.id === value)
                    setFormData({ ...formData, droneId: value, droneName: drone?.name || '' })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择无人机" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDrones.map((drone) => (
                      <SelectItem key={drone.id} value={drone.id}>
                        {drone.name} ({drone.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="executeTime">执行时间</Label>
                <Input
                  id="executeTime"
                  type="datetime-local"
                  value={formData.executeTime}
                  onChange={(e) => setFormData({ ...formData, executeTime: e.target.value })}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label>重复</Label>
                <Select
                  value={formData.repeat}
                  onValueChange={(value) => setFormData({ ...formData, repeat: value as RepeatType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">不重复</SelectItem>
                    <SelectItem value="daily">每日</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>AI 设置</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="realTimeAnalysis"
                      checked={formData.realTimeAnalysis}
                      onCheckedChange={(checked) => setFormData({ ...formData, realTimeAnalysis: !!checked })}
                    />
                    <Label htmlFor="realTimeAnalysis">开启实时分析</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="autoAlert"
                      checked={formData.autoAlert}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoAlert: !!checked })}
                    />
                    <Label htmlFor="autoAlert">异常自动告警</Label>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="notifyPhone"
                        checked={formData.notifyPhone}
                        onCheckedChange={(checked) => setFormData({ ...formData, notifyPhone: !!checked })}
                      />
                      <Label htmlFor="notifyPhone">手机通知</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="notifyEmail"
                        checked={formData.notifyEmail}
                        onCheckedChange={(checked) => setFormData({ ...formData, notifyEmail: !!checked })}
                      />
                      <Label htmlFor="notifyEmail">邮件通知</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 步骤4: 确认提交 */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">任务确认</h3>
              <dl className="space-y-2 bg-muted p-4 rounded-lg">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">任务名称</dt>
                  <dd className="font-medium">{formData.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">任务类型</dt>
                  <dd>{TASK_TYPE_LABELS[formData.type]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">优先级</dt>
                  <dd>{TASK_PRIORITY_LABELS[formData.priority]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">航线</dt>
                  <dd>{selectedRoute?.name || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">执行无人机</dt>
                  <dd>{selectedDrone?.name || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">执行时间</dt>
                  <dd>{formData.executeTime ? new Date(formData.executeTime).toLocaleString('zh-CN') : '立即执行'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">重复</dt>
                  <dd>{formData.repeat === 'none' ? '不重复' : formData.repeat}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">AI分析</dt>
                  <dd>{formData.realTimeAnalysis ? '开启' : '关闭'}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* 导航按钮 */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
            >
              上一步
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                提交任务
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}