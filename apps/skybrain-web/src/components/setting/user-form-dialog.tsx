import { useState, useEffect } from 'react'
import { useSettingStore } from '@/stores/setting-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { User } from '@/data/mock-settings'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSave: (user: User) => void
}

const roleNameToValue: Record<string, string> = {
  '管理员': 'admin',
  '安保人员': 'security',
  '运维人员': 'operations',
  '教师': 'teacher',
  '学生': 'student'
}

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
  const { roles } = useSettingStore()
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    name: '',
    role: 'student',
    department: '',
    status: 'active',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({
        username: '',
        name: '',
        role: 'student',
        department: '',
        status: 'active',
        email: '',
        phone: ''
      })
    }
  }, [user, open])

  const handleSubmit = () => {
    if (!formData.username || !formData.name || !formData.email) return

    const newUser: User = {
      id: user?.id || Date.now().toString(),
      username: formData.username!,
      name: formData.name!,
      role: formData.role as User['role'],
      department: formData.department || '未设置',
      status: formData.status as User['status'],
      email: formData.email!,
      phone: formData.phone,
      createdAt: user?.createdAt || new Date().toISOString().replace('T', ' ').slice(0, 19)
    }
    onSave(newUser)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? '编辑用户' : '添加用户'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">账号</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="请输入账号"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入姓名"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role">角色</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={roleNameToValue[role.name] || 'student'}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">部门</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="请输入部门"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入邮箱"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">手机</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入手机号"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">状态</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as User['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">启用</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}