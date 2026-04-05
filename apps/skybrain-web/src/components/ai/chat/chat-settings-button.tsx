import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatSettingsButtonProps {
  onClick: () => void
}

export function ChatSettingsButton({ onClick }: ChatSettingsButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <Settings className="h-4 w-4" />
    </Button>
  )
}