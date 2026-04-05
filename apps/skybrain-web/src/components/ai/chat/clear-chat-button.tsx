import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ClearChatButtonProps {
  onClick: () => void
}

export function ClearChatButton({ onClick }: ClearChatButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <Trash2 className="h-4 w-4 mr-1" />
      清空
    </Button>
  )
}