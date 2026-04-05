import { Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceInputButtonProps {
  isRecording: boolean
  onRecordingChange: (v: boolean) => void
  disabled?: boolean
}

export function VoiceInputButton({ isRecording, onRecordingChange, disabled }: VoiceInputButtonProps) {
  return (
    <Button
      size="lg"
      variant={isRecording ? 'destructive' : 'default'}
      className={`h-16 w-16 rounded-full transition-all ${isRecording ? 'animate-pulse' : ''}`}
      onClick={() => onRecordingChange(!isRecording)}
      disabled={disabled}
    >
      {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </Button>
  )
}