interface ConfidenceScoreProps {
  score: number
  label?: string
}

export function ConfidenceScore({ score, label }: ConfidenceScoreProps) {
  const percentage = Math.round(score * 100)
  const color = percentage >= 80 ? 'text-green-500' : percentage >= 60 ? 'text-yellow-500' : 'text-red-500'

  return (
    <span className={`text-xs ${color}`} title={label}>
      ({percentage}%)
    </span>
  )
}