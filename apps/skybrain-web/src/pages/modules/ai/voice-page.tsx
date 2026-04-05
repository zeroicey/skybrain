import { useState } from 'react'
import { useAIStore } from '@/stores/ai-store'
import { processVoiceCommand, mockCommandExamples } from '@/data/mock-ai'
import { VoiceStatusIndicator } from '@/components/ai/voice/voice-status-indicator'
import { VoiceVisualizer } from '@/components/ai/voice/voice-visualizer'
import { VoiceInputButton } from '@/components/ai/voice/voice-input-button'
import { CommandHistoryList } from '@/components/ai/voice/command-history-list'
import { CommandExampleList } from '@/components/ai/voice/command-example-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VoicePage() {
  const { isListening, setListening, commandHistory, addCommand, clearHistory } = useAIStore()
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle')
  const [recognizedText, setRecognizedText] = useState('')

  const handleRecordingChange = async (recording: boolean) => {
    if (recording) {
      setStatus('listening')
      setListening(true)
      // 模拟语音识别
      setTimeout(async () => {
        setStatus('processing')
        setListening(false)

        // 模拟识别结果
        const mockText = mockCommandExamples[Math.floor(Math.random() * mockCommandExamples.length)]
        setRecognizedText(mockText)

        try {
          const response = await processVoiceCommand(mockText)
          if (response.success && response.data) {
            addCommand(response.data)
          }
        } finally {
          setStatus('idle')
          setRecognizedText('')
        }
      }, 2000)
    } else {
      setStatus('idle')
      setListening(false)
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle>语音控制</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 状态指示 */}
          <VoiceStatusIndicator status={status} />

          {/* 语音波形 */}
          <div className="flex flex-col items-center justify-center py-8 bg-muted/30 rounded-lg">
            <VoiceVisualizer isListening={isListening} />
            <div className="mt-4">
              <VoiceInputButton
                isRecording={isListening}
                onRecordingChange={handleRecordingChange}
              />
            </div>
            {recognizedText && (
              <p className="mt-4 text-sm text-muted-foreground">
                识别到: "{recognizedText}"
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 指令历史 */}
      <Card>
        <CardContent className="pt-6">
          <CommandHistoryList commands={commandHistory} onClear={clearHistory} />
        </CardContent>
      </Card>

      {/* 指令示例 */}
      <CommandExampleList examples={mockCommandExamples} />
    </div>
  )
}