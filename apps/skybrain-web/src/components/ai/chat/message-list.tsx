import type { AIMessage } from '@/types/ai'
import { UserMessage } from './user-message'
import { AIMessageComponent } from './ai-message'

interface MessageListProps {
  messages: AIMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage key={msg.id} message={msg} />
        ) : (
          <AIMessageComponent key={msg.id} message={msg} />
        )
      )}
    </div>
  )
}