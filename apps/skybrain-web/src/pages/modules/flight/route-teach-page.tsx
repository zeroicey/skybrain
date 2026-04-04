import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Play, Square, Pause, RotateCcw, Save, Drone, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// 模拟可选场景
const sceneOptions = [
  { id: 'canteen', name: '食堂', icon: '🍽️' },
  { id: 'shop', name: '商铺', icon: '🏪' },
  { id: 'dormitory', name: '宿舍', icon: '🏠' },
  { id: 'building', name: '楼宇', icon: '🏢' },
  { id: 'gate', name: '校门', icon: '🚪' }
]

type RecordingState = 'idle' | 'recording' | 'paused' | 'completed'

export default function RouteTeachPage() {
  const navigate = useNavigate()
  const [routeName, setRouteName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedScene, setSelectedScene] = useState<string>('')
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [waypoints, setWaypoints] = useState<Array<{ id: number; x: number; y: number; z: number }>>([])

  const handleStartRecording = () => {
    setRecordingState('recording')
    // 开始计时
    setInterval(() => {
      setRecordingTime(t => t + 1)
    }, 1000)
  }

  const handlePauseRecording = () => {
    setRecordingState('paused')
  }

  const handleResumeRecording = () => {
    setRecordingState('recording')
  }

  const handleStopRecording = () => {
    setRecordingState('completed')
  }

  const handleReset = () => {
    setRecordingState('idle')
    setRecordingTime(0)
    setWaypoints([])
  }

  const handleSave = () => {
    // 保存航线的逻辑
    console.log('保存航线:', { routeName, description, selectedScene, waypoints })
    navigate('/flight/routes')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/flight/routes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">示教录制</h1>
        <Badge variant="outline" className="ml-auto">
          端侧示教模式
        </Badge>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>航线信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="routeName">航线名称</Label>
              <Input
                id="routeName"
                placeholder="请输入航线名称"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>应用场景</Label>
              <div className="flex gap-2">
                {sceneOptions.map(scene => (
                  <Button
                    key={scene.id}
                    variant={selectedScene === scene.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedScene(scene.id)}
                  >
                    {scene.icon} {scene.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">航线描述</Label>
            <Input
              id="description"
              placeholder="请输入航线描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 录制控制区 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Drone className="h-5 w-5" />
            录制控制
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 模拟地图/控制区 */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* 模拟无人机位置 */}
            {recordingState !== 'idle' && (
              <div className="absolute flex items-center gap-2 bg-background/90 px-3 py-2 rounded-full">
                <Drone className="h-5 w-5 text-primary animate-pulse" />
                <span>无人机已连接</span>
              </div>
            )}

            {/* 航点显示 */}
            {waypoints.length > 0 && (
              <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-2 rounded-lg">
                <span className="text-sm">已录制航点: {waypoints.length}</span>
              </div>
            )}

            {recordingState === 'idle' && (
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>点击开始录制后，无人机将开始记录飞行轨迹</p>
              </div>
            )}
          </div>

          {/* 录制状态和时间 */}
          <div className="flex items-center justify-center gap-4">
            {recordingState === 'recording' && (
              <div className="flex items-center gap-2 text-red-500">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xl font-mono font-bold">{formatTime(recordingTime)}</span>
              </div>
            )}
            {recordingState === 'paused' && (
              <div className="flex items-center gap-2 text-yellow-500">
                <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-xl font-mono font-bold">{formatTime(recordingTime)} (已暂停)</span>
              </div>
            )}
            {recordingState === 'completed' && (
              <div className="flex items-center gap-2 text-green-500">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xl font-mono font-bold">录制完成 - {formatTime(recordingTime)}</span>
              </div>
            )}
          </div>

          {/* 控制按钮 */}
          <div className="flex justify-center gap-4">
            {recordingState === 'idle' && (
              <Button size="lg" onClick={handleStartRecording}>
                <Play className="h-5 w-5 mr-2" />
                开始录制
              </Button>
            )}

            {recordingState === 'recording' && (
              <>
                <Button size="lg" variant="outline" onClick={handlePauseRecording}>
                  <Pause className="h-5 w-5 mr-2" />
                  暂停
                </Button>
                <Button size="lg" variant="destructive" onClick={handleStopRecording}>
                  <Square className="h-5 w-5 mr-2" />
                  停止
                </Button>
              </>
            )}

            {recordingState === 'paused' && (
              <>
                <Button size="lg" onClick={handleResumeRecording}>
                  <Play className="h-5 w-5 mr-2" />
                  继续
                </Button>
                <Button size="lg" variant="destructive" onClick={handleStopRecording}>
                  <Square className="h-5 w-5 mr-2" />
                  停止
                </Button>
              </>
            )}

            {recordingState === 'completed' && (
              <>
                <Button size="lg" variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  重新录制
                </Button>
                <Button size="lg" onClick={handleSave} disabled={!routeName || !selectedScene}>
                  <Save className="h-5 w-5 mr-2" />
                  保存航线
                </Button>
              </>
            )}
          </div>

          {/* 录制提示 */}
          {recordingState !== 'idle' && (
            <div className="text-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              {recordingState === 'recording' && '正在录制飞行轨迹，请操控无人机按预定路线飞行'}
              {recordingState === 'paused' && '录制已暂停，可以继续或停止'}
              {recordingState === 'completed' && '录制完成，可以保存或重新录制'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}