import { Bot } from 'lucide-react'
import type { AIMessage } from '@/types/ai'
import { MarkdownRenderer } from './markdown-renderer'
import { TypingIndicator } from './typing-indicator'

export function AIMessageComponent({ message }: { message: AIMessage }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        {message.isLoading ? (
          <TypingIndicator visible={true} />
        ) : message.error ? (
          <div className="text-destructive text-sm">{message.error}</div>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  )
}