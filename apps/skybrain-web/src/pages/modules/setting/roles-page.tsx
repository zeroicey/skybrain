import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useSettingStore } from '@/stores/setting-store'
import { RoleList } from '@/components/setting/role-list'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Role } from '@/data/mock-settings'

export default function RolesPage() {
  const { roles, setRoles } = useSettingStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    userCount: 0,
    permissions: [] as string[]
  })

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      userCount: role.userCount,
      permissions: role.permissions
    })
    setDialogOpen(true)
  }

  const handleDelete = (role: Role) => {
    const newRoles = roles.filter(r => r.id !== role.id)
    setRoles(newRoles)
    toast.success('角色已删除')
  }

  const handleSave = () => {
    if (!formData.name) return

    const newRole: Role = {
      id: editingRole?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      userCount: editingRole?.userCount || 0,
      permissions: formData.permissions.length > 0 ? formData.permissions : ['*']
    }

    if (editingRole) {
      setRoles(roles.map(r => r.id === newRole.id ? newRole : r))
      toast.success('角色已更新')
    } else {
      setRoles([...roles, newRole])
      toast.success('角色已添加')
    }

    setDialogOpen(false)
    setEditingRole(null)
    setFormData({ name: '', description: '', userCount: 0, permissions: [] })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">角色权限</h1>
        <Button onClick={() => { setEditingRole(null); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          添加角色
        </Button>
      </div>

      <RoleList
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRole ? '编辑角色' : '添加角色'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">角色名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入角色名称"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入角色描述"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}