import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommandResult } from './command-result'
import type { CommandHistory } from '@/types/ai'

interface CommandHistoryListProps {
  commands: CommandHistory[]
  onClear?: () => void
}

export function CommandHistoryList({ commands, onClear }: CommandHistoryListProps) {
  if (commands.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        暂无指令历史
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">语音指令历史</h3>
        {onClear && commands.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="h-3 w-3 mr-1" />
            清空
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {commands.map((cmd) => (
          <CommandResult key={cmd.id} command={cmd} />
        ))}
      </div>
    </div>
  )
}