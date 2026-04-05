import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ParsedTask, Task } from '@/types/ai'
import { mockDrones } from '@/data/mock-drones'
import { mockRoutes } from '@/data/mock-tasks'

interface TaskConfirmFormProps {
  parsed: ParsedTask
  onSubmit: (task: Task) => void
  onCancel: () => void
}

export function TaskConfirmForm({ parsed, onSubmit, onCancel }: TaskConfirmFormProps) {
  const [formData, setFormData] = useState({
    name: parsed.description || `${parsed.location || ''}日常巡检`,
    type: parsed.taskType || 'patrol',
    droneId: parsed.droneId || '',
    executeTime: parsed.executeTime || '',
    routeId: parsed.routeId || '',
  })

  const handleSubmit = () => {
    const drone = mockDrones.find(d => d.id === formData.droneId)
    const route = mockRoutes.find(r => r.id === formData.routeId)
    onSubmit({
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as Task['type'],
      droneId: formData.droneId,
      droneName: drone?.name,
      executeTime: formData.executeTime,
      routeId: formData.routeId,
      routeName: route?.name,
      description: parsed.description,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>任务名称</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>任务类型</Label>
        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patrol">巡逻</SelectItem>
            <SelectItem value="inspection">巡检</SelectItem>
            <SelectItem value="logistics">物流</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>执行无人机</Label>
        <Select value={formData.droneId} onValueChange={(v) => setFormData({ ...formData, droneId: v })}>
          <SelectTrigger>
            <SelectValue placeholder="选择无人机" />
          </SelectTrigger>
          <SelectContent>
            {mockDrones.map((drone) => (
              <SelectItem key={drone.id} value={drone.id}>
                {drone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>执行时间</Label>
        <Input
          type="datetime-local"
          value={formData.executeTime}
          onChange={(e) => setFormData({ ...formData, executeTime: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>航线</Label>
        <Select value={formData.routeId} onValueChange={(v) => setFormData({ ...formData, routeId: v })}>
          <SelectTrigger>
            <SelectValue placeholder="选择航线" />
          </SelectTrigger>
          <SelectContent>
            {mockRoutes.map((route) => (
              <SelectItem key={route.id} value={route.id}>
                {route.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button onClick={handleSubmit}>确认创建</Button>
      </div>
    </div>
  )
}