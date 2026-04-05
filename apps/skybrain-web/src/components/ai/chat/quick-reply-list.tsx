import { Button } from '@/components/ui/button'
import type { QuickReply } from '@/types/ai'

interface QuickReplyListProps {
  replies: QuickReply[]
  onSelect: (query: string) => void
}

export function QuickReplyList({ replies, onSelect }: QuickReplyListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {replies.map((reply) => (
        <Button
          key={reply.id}
          variant="outline"
          size="sm"
          onClick={() => onSelect(reply.query)}
          className="text-xs"
        >
          {reply.label}
        </Button>
      ))}
    </div>
  )
}