import { useState } from 'react'
import { Pencil, Trash2, Users, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { PermissionTree } from './permission-tree'
import type { Role } from '@/data/mock-settings'

interface RoleListProps {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleList({ roles, onEdit, onDelete }: RoleListProps) {
  const [expandedRole, setExpandedRole] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <Card key={role.id}>
          <Collapsible
            open={expandedRole === role.id}
            onOpenChange={(open) => setExpandedRole(open ? role.id : null)}
          >
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {expandedRole === role.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div>
                  <CardTitle className="text-base">{role.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{role.userCount} 人</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(role)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => onDelete(role)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0 border-t">
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">权限配置</h4>
                  <PermissionTree
                    selectedPermissions={role.permissions}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  )
}