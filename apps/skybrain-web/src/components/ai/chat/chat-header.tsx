import { Bot, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onClear: () => void
  onSettings?: () => void
}

export function ChatHeader({ onClear, onSettings }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" />
        <h2 className="text-lg font-semibold">智能问答</h2>
      </div>
      <div className="flex gap-2">
        {onSettings && (
          <Button variant="ghost" size="sm" onClick={onSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4 mr-1" />
          清空
        </Button>
      </div>
    </div>
  )
}