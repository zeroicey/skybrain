import { CheckCircle } from 'lucide-react'
import { ConfidenceScore } from './confidence-score'

interface ParsedFieldProps {
  label: string
  value: string
  confidence?: number
}

export function ParsedField({ label, value, confidence }: ParsedFieldProps) {
  if (!value) return null

  return (
    <div className="flex items-center gap-2 py-1">
      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
      <span className="text-sm">
        <span className="text-muted-foreground">{label}: </span>
        <span className="font-medium">{value}</span>
      </span>
      {confidence !== undefined && confidence < 1 && (
        <ConfidenceScore score={confidence} />
      )}
    </div>
  )
}