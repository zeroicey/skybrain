import { useEffect, useState } from 'react'

interface VoiceVisualizerProps {
  isListening: boolean
}

export function VoiceVisualizer({ isListening }: VoiceVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(20).fill(10))

  useEffect(() => {
    if (!isListening) {
      setBars(Array(20).fill(10))
      return
    }

    const interval = setInterval(() => {
      setBars(Array(20).fill(0).map(() => Math.random() * 60 + 10))
    }, 100)

    return () => clearInterval(interval)
  }, [isListening])

  return (
    <div className="flex items-center justify-center gap-1 h-20">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-2 rounded-full transition-all duration-100 ${
            isListening ? 'bg-primary' : 'bg-muted'
          }`}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}