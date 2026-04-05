import type { AIMessage } from '@/types/ai'

export function UserMessage({ message }: { message: AIMessage }) {
  return (
    <div className="flex justify-end">
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg max-w-[80%]">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}