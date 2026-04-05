import { useState } from 'react'
import { useAIStore } from '@/stores/ai-store'
import { parseTaskDescriptionAPI } from '@/data/mock-ai'
import { DescriptionInput } from '@/components/ai/task-create/description-input'
import { ParseResultPanel } from '@/components/ai/task-create/parse-result-panel'
import { TaskConfirmForm } from '@/components/ai/task-create/task-confirm-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function TaskCreatePage() {
  const navigate = useNavigate()
  const { parsedTask, setParsedTask, isParsing, setParsing, clearParsedTask } = useAIStore()
  const [description, setDescription] = useState('')
  const [step, setStep] = useState<'input' | 'result' | 'confirm'>('input')
  const [error, setError] = useState<string | null>(null)

  const handleParse = async () => {
    if (!description.trim()) return

    setParsing(true)
    setError(null)

    try {
      const response = await parseTaskDescriptionAPI(description)
      if (response.success && response.data) {
        setParsedTask(response.data)
        setStep('result')
      } else {
        setError(response.error?.message || '解析失败')
      }
    } catch (err) {
      setError('解析服务暂时不可用')
    } finally {
      setParsing(false)
    }
  }

  const handleConfirm = () => {
    setStep('confirm')
  }

  const handleSubmit = (task: any) => {
    // TODO: 调用创建任务的API
    console.log('创建任务:', task)
    clearParsedTask()
    navigate('/tasks')
  }

  const handleCancel = () => {
    clearParsedTask()
    setDescription('')
    setStep('input')
  }

  return (
    <div className="p-6 space-y-6 overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle>自然语言任务创建</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {step === 'input' && (
            <DescriptionInput
              value={description}
              onChange={setDescription}
              onParse={handleParse}
              isLoading={isParsing}
            />
          )}

          {step === 'result' && parsedTask && (
            <>
              <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">解析完成</span>
              </div>
              <ParseResultPanel result={parsedTask} />
              <div className="flex justify-end gap-2">
                <button className="text-sm text-muted-foreground hover:underline" onClick={handleCancel}>
                  重新输入
                </button>
                <button
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  onClick={handleConfirm}
                >
                  继续
                </button>
              </div>
            </>
          )}

          {step === 'confirm' && parsedTask && (
            <TaskConfirmForm
              parsed={parsedTask}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}