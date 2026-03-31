import { Check, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Log } from '@/data/mock-settings'

interface LogListProps {
  logs: Log[]
  onViewDetails?: (log: Log) => void
}

export function LogList({ logs, onViewDetails }: LogListProps) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  log.status === 'success' ? "bg-green-100" : "bg-red-100"
                )}>
                  {log.status === 'success' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{log.target}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>操作人: {log.operatorName}</span>
                    <span>IP: {log.ip}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  {log.details && (
                    <p className="text-sm text-red-500 mt-1">{log.details}</p>
                  )}
                </div>
              </div>
              {onViewDetails && (
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(log)}>
                  详情
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}