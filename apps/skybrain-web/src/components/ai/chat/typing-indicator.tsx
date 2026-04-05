export function TypingIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div className="flex items-center gap-1 p-3 bg-muted rounded-lg w-fit">
      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}