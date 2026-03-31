import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface PermissionNode {
  id: string
  label: string
  children?: PermissionNode[]
}

const permissionData: PermissionNode[] = [
  {
    id: 'dashboard',
    label: '仪表盘',
    children: [
      { id: 'dashboard.view', label: '查看' }
    ]
  },
  {
    id: 'monitor',
    label: '实时监控',
    children: [
      { id: 'monitor.view', label: '查看' },
      { id: 'monitor.control', label: '控制' }
    ]
  },
  {
    id: 'tasks',
    label: '任务管理',
    children: [
      { id: 'tasks.view', label: '查看' },
      { id: 'tasks.create', label: '创建' },
      { id: 'tasks.edit', label: '编辑' },
      { id: 'tasks.delete', label: '删除' }
    ]
  },
  {
    id: 'device',
    label: '设备管理',
    children: [
      { id: 'device.view', label: '查看' },
      { id: 'device.edit', label: '编辑' },
      { id: 'device.maintenance', label: '维护' }
    ]
  },
  {
    id: 'flight',
    label: '飞行管理',
    children: [
      { id: 'flight.view', label: '查看' },
      { id: 'flight.edit', label: '编辑' }
    ]
  },
  {
    id: 'scenes',
    label: '场景分析',
    children: [
      { id: 'scenes.view', label: '查看' }
    ]
  },
  {
    id: 'settings',
    label: '系统设置',
    children: [
      { id: 'settings.view', label: '查看' },
      { id: 'settings.edit', label: '编辑' }
    ]
  }
]

interface PermissionTreeProps {
  selectedPermissions: string[]
  onChange: (permissions: string[]) => void
  readOnly?: boolean
}

function PermissionNodeComponent({
  node,
  selectedPermissions,
  onChange,
  readOnly
}: {
  node: PermissionNode
  selectedPermissions: string[]
  onChange: (permissions: string[]) => void
  readOnly?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedPermissions.includes(node.id)
  const isWildcard = selectedPermissions.includes('*')

  const handleToggle = () => {
    if (readOnly) return
    if (hasChildren) {
      setIsOpen(!isOpen)
    }
  }

  const handleSelect = (checked: boolean) => {
    if (readOnly) return
    if (isWildcard) return

    let newPermissions: string[]
    if (checked) {
      newPermissions = [...selectedPermissions, node.id]
    } else {
      newPermissions = selectedPermissions.filter(p => p !== node.id)
    }
    onChange(newPermissions)
  }

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 py-1">
        {hasChildren && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleToggle}>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}
        {!hasChildren && <div className="w-6" />}

        <input
          type="checkbox"
          checked={isSelected || isWildcard}
          onChange={(e) => handleSelect(e.target.checked)}
          disabled={readOnly || isWildcard}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className={cn(isSelected && !hasChildren && "font-medium")}>{node.label}</span>
      </div>

      {hasChildren && isOpen && (
        <CollapsibleContent>
          {node.children!.map((child) => (
            <PermissionNodeComponent
              key={child.id}
              node={child}
              selectedPermissions={selectedPermissions}
              onChange={onChange}
              readOnly={readOnly}
            />
          ))}
        </CollapsibleContent>
      )}
    </div>
  )
}

export function PermissionTree({ selectedPermissions, onChange, readOnly = false }: PermissionTreeProps) {
  return (
    <div className="border rounded-md p-4 space-y-2">
      {permissionData.map((node) => (
        <PermissionNodeComponent
          key={node.id}
          node={node}
          selectedPermissions={selectedPermissions}
          onChange={onChange}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}