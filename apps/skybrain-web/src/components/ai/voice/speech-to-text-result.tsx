import { Check, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SpeechToTextResultProps {
  text: string
  isFinal: boolean
  onConfirm: () => void
}

export function SpeechToTextResult({ text, isFinal, onConfirm }: SpeechToTextResultProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <Volume2 className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-sm">"{text}"</span>
      {isFinal && (
        <Button size="sm" onClick={onConfirm}>
          <Check className="h-4 w-4 mr-1" />
          确认
        </Button>
      )}
    </div>
  )
}