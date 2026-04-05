import { CheckCircle, XCircle, Mic } from 'lucide-react'
import type { CommandHistory } from '@/types/ai'

interface CommandResultProps {
  command: CommandHistory
}

export function CommandResult({ command }: CommandResultProps) {
  return (
    <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
      <Mic className="h-4 w-4 mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">"{command.command}"</p>
        <div className="flex items-center gap-2 mt-1">
          {command.success ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : (
            <XCircle className="h-3 w-3 text-destructive" />
          )}
          <span className="text-xs text-muted-foreground">{command.message}</span>
        </div>
      </div>
    </div>
  )
}