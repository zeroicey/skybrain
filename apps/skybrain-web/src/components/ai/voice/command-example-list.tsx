interface CommandExampleListProps {
  examples: string[]
}

export function CommandExampleList({ examples }: CommandExampleListProps) {
  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
      <h3 className="text-sm font-medium mb-2">支持的指令示例</h3>
      <ul className="space-y-1">
        {examples.map((example, i) => (
          <li key={i} className="text-sm text-muted-foreground">
            • {example}
          </li>
        ))}
      </ul>
    </div>
  )
}