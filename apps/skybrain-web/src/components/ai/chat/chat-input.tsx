import { useState } from 'react'
import { Send, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  onSend: (text: string) => void
  onVoice?: () => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, onVoice, disabled, placeholder = '输入问题...' }: ChatInputProps) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim())
      setText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[44px] max-h-[200px] resize-none"
        rows={1}
      />
      {onVoice && (
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onVoice}
          disabled={disabled}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}