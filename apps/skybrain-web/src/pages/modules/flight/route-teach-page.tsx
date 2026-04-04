import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Play, Square, Pause, RotateCcw, Save, Drone, MapPin, Wifi, Zap, Camera } from 'lucide-react'
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

// ============ 调试模式配置 ============
// 修改这里来测试不同情况:
// - 'success': 模拟自检成功
// - 'fail': 模拟自检失败
// - 'timeout': 模拟连接超时
const DEBUG_SELF_CHECK_MODE: 'success' | 'fail' | 'timeout' = 'success'
// ======================================

// 自检成功日志
const selfCheckSuccessLogs = [
  '> SkyBrain 系统启动中...',
  '> [WIFI] 正在建立通讯链路...',
  '> [WIFI] 通讯链路建立成功，延迟 12ms',
  '> [ESP32] 正在握手...',
  '> [ESP32] 通信握手成功，心跳正常',
  '> [IMU] 陀螺仪状态正常，自检通过',
  '> [IMU] 加速度计校准完成',
  '> [DepthCamera] 深度相机视频流就绪 (30fps)',
  '> [Battery] 电量 98%，准许起飞',
  '> [System] 所有系统检查通过，可以起飞'
]

// 自检失败日志
const selfCheckFailLogs = [
  '> SkyBrain 系统启动中...',
  '> [WIFI] 正在建立通讯链路...',
  '> [WIFI] 通讯链路建立成功，延迟 12ms',
  '> [ESP32] 正在握手...',
  '> [ESP32] ❌ 通信握手失败，无响应',
  '> [IMU] ❌ 陀螺仪校准失败，传感器异常',
  '> [System] ❌ 自检未通过，请检查设备连接'
]

// 超时日志
const selfCheckTimeoutLogs = [
  '> SkyBrain 系统启动中...',
  '> [WIFI] 正在建立通讯链路...',
  '> [WIFI] ⏳ 通讯链路建立中，等待响应...',
  '> [WIFI] ❌ 连接超时 (30s)',
  '> [ESP32] 正在握手...',
  '> [ESP32] ⏳ 等待响应中...',
  '> [ESP32] ❌ 连接超时 (30s)',
  '> [System] ❌ 连接超时，请检查网络或设备'
]

// 根据调试模式获取当前日志数组
const getSelfCheckLogs = () => {
  switch (DEBUG_SELF_CHECK_MODE) {
    case 'fail':
      return selfCheckFailLogs
    case 'timeout':
      return selfCheckTimeoutLogs
    default:
      return selfCheckSuccessLogs
  }
}

// SLAM 录制日志
const slamLogs = [
  '> [Edge_Node] 正在构建实时空间拓扑 (SLAM)...',
  '> [Edge_Node] 检测到关键特征点, pts=124',
  '> [Edge_Node] 剔除动态障碍物噪点...',
  '> [Edge_Node] 检测到关键特征点, pts=286',
  '> [Edge_Node] 检测到关键特征点, pts=542',
  '> [Edge_Node] 领飞路线转弯，增加采集权重...',
  '> [Edge_Node] 检测到关键特征点, pts=768',
  '> [Edge_Node] 检测到关键特征点, pts=1024',
  '> [Edge_Node] 空间拓扑构建完成',
  '> [Edge_Node] 录制结束。压缩特征包中...',
  '> [System] 航线数据已保存'
]

// 流程阶段（添加失败和超时状态）
type FlowPhase = 'idle' | 'self-check' | 'ready' | 'recording' | 'paused' | 'completed' | 'self-check-fail' | 'self-check-timeout'

export default function RouteTeachPage() {
  const navigate = useNavigate()
  const [routeName, setRouteName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedScene, setSelectedScene] = useState<string>('')
  const [flowPhase, setFlowPhase] = useState<FlowPhase>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [waypoints, setWaypoints] = useState<Array<{ id: number; x: number; y: number; z: number }>>([])
  const [logs, setLogs] = useState<string[]>(['> SkyBrain 控制台就绪'])

  // 使用 useRef 存储定时器引用
  const timerRef = useRef<number | null>(null)
  const logIndexRef = useRef<number>(0)
  const currentLogListRef = useRef<string[]>([])

  // 安全清理所有定时器
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    logIndexRef.current = 0
    currentLogListRef.current = []
  }, [])

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [clearAllTimers])

  // 打印日志的 useEffect - 受控方式
  useEffect(() => {
    // 如果不在自检或录制阶段，不处理
    if (flowPhase !== 'self-check' && flowPhase !== 'recording' && flowPhase !== 'ready') {
      return
    }

    // 获取当前要打印的日志列表
    const logList = flowPhase === 'self-check' ? getSelfCheckLogs() : slamLogs

    // 如果已经打印完毕，不处理
    if (logIndexRef.current >= logList.length) {
      // 检查是否为失败或超时情况
      if (flowPhase === 'self-check') {
        const debugMode = DEBUG_SELF_CHECK_MODE
        if (debugMode === 'fail') {
          setFlowPhase('self-check-fail')
        } else if (debugMode === 'timeout') {
          setFlowPhase('self-check-timeout')
        } else {
          setFlowPhase('ready')
        }
      }
      return
    }

    // 设置定时器打印下一条日志
    const interval = flowPhase === 'self-check' ? 400 : 800
    const timer = setTimeout(() => {
      const currentIndex = logIndexRef.current
      if (currentIndex < logList.length) {
        setLogs(prev => [...prev, logList[currentIndex]])
        logIndexRef.current = currentIndex + 1

        // 检查是否打印完毕
        if (currentIndex + 1 >= logList.length) {
          if (flowPhase === 'self-check') {
            // 自检完成，根据调试模式切换到对应状态
            const debugMode = DEBUG_SELF_CHECK_MODE
            if (debugMode === 'fail') {
              setFlowPhase('self-check-fail')
            } else if (debugMode === 'timeout') {
              setFlowPhase('self-check-timeout')
            } else {
              setFlowPhase('ready')
            }
          } else if (flowPhase === 'recording') {
            // 录制完成
            setFlowPhase('completed')
          }
        }
      }
    }, interval)

    return () => clearTimeout(timer)
  }, [flowPhase])

  // 计时器 useEffect
  useEffect(() => {
    if (flowPhase === 'recording') {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [flowPhase])

  // 开始自检
  const handleStartSelfCheck = () => {
    clearAllTimers()
    setLogs(['> SkyBrain 控制台初始化...'])
    logIndexRef.current = 0
    currentLogListRef.current = getSelfCheckLogs()
    setFlowPhase('self-check')
  }

  // 开始录制
  const handleStartRecording = () => {
    logIndexRef.current = 0
    currentLogListRef.current = slamLogs
    setFlowPhase('recording')
  }

  // 暂停录制
  const handlePauseRecording = () => {
    setFlowPhase('paused')
  }

  // 继续录制
  const handleResumeRecording = () => {
    logIndexRef.current = 0
    currentLogListRef.current = slamLogs
    setFlowPhase('recording')
  }

  // 停止录制
  const handleStopRecording = () => {
    clearAllTimers()
    setFlowPhase('completed')
  }

  // 重置
  const handleReset = () => {
    clearAllTimers()
    setFlowPhase('idle')
    setRecordingTime(0)
    setWaypoints([])
    setLogs(['> SkyBrain 控制台就绪'])
  }

  // 保存
  const handleSave = () => {
    clearAllTimers()
    console.log('保存航线:', { routeName, description, selectedScene, waypoints })
    navigate('/flight/routes')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 获取日志颜色
  const getLogColor = (log: string, index: number, _total: number) => {
    if (index === 0) return 'text-green-400'
    if (log.includes('[WIFI]')) return 'text-blue-400'
    if (log.includes('[ESP32]')) return 'text-cyan-400'
    if (log.includes('[IMU]')) return 'text-yellow-400'
    if (log.includes('[DepthCamera]')) return 'text-purple-400'
    if (log.includes('[Battery]')) return 'text-emerald-400'
    if (log.includes('[System]')) return 'text-green-300'
    if (log.includes('[Edge_Node]')) return 'text-green-300'
    return 'text-green-500'
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
              <div className="flex gap-2 flex-wrap">
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

      {/* 录制控制区 - 固定最小高度防止抖动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[550px]">
        {/* 左侧：终端控制台 - 固定高度 */}
        <Card className="bg-black border-green-900 overflow-hidden">
          <CardHeader className="pb-2 border-b border-green-900/50">
            <CardTitle className="text-green-400 flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              TERMINAL - Edge Computing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* 终端窗口 - 固定高度，黑客帝国风格 */}
            <div className="h-64 overflow-y-auto p-4 font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${getLogColor(log, index, logs.length)} ${
                    index === logs.length - 1 && (flowPhase === 'self-check' || flowPhase === 'recording')
                      ? 'animate-pulse'
                      : ''
                  }`}
                >
                  <span className="text-green-600 mr-2">$</span>
                  {log}
                  {index === logs.length - 1 && (flowPhase === 'self-check' || flowPhase === 'recording') && (
                    <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 右侧：录制控制 - 固定高度 */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Drone className="h-5 w-5" />
              录制控制
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {/* 模拟地图/控制区 - 固定高度 */}
            <div className="h-40 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* 模拟无人机位置 */}
              {(flowPhase === 'self-check' || flowPhase === 'ready' || flowPhase === 'recording' || flowPhase === 'paused' || flowPhase === 'completed') && (
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

              {flowPhase === 'idle' && (
                <div className="text-center text-muted-foreground px-4">
                  <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">点击"连接无人机"开始系统自检</p>
                </div>
              )}
            </div>

            {/* 状态指示器 */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* 阶段指示 */}
              <Badge variant={flowPhase === 'idle' ? 'secondary' : 'default'} className="gap-1">
                {flowPhase === 'idle' && '等待连接'}
                {flowPhase === 'self-check' && <><Zap className="h-3 w-3" /> 自检中...</>}
                {flowPhase === 'ready' && <><Wifi className="h-3 w-3" /> 就绪</>}
                {flowPhase === 'recording' && <><Camera className="h-3 w-3" /> 录制中</>}
                {flowPhase === 'paused' && '已暂停'}
                {flowPhase === 'completed' && '已完成'}
              </Badge>

              {/* 计时器 */}
              {(flowPhase === 'recording' || flowPhase === 'paused') && (
                <span className={`text-xl font-mono font-bold ${flowPhase === 'paused' ? 'text-yellow-500' : 'text-red-500'}`}>
                  {formatTime(recordingTime)}
                </span>
              )}
              {flowPhase === 'completed' && (
                <span className="text-xl font-mono font-bold text-green-500">
                  {formatTime(recordingTime)}
                </span>
              )}
            </div>

            {/* 控制按钮 */}
            <div className="flex justify-center gap-3 flex-wrap">
              {/* 阶段1: 等待连接 */}
              {flowPhase === 'idle' && (
                <Button size="lg" onClick={handleStartSelfCheck} className="gap-2">
                  <Wifi className="h-5 w-5" />
                  连接无人机并执行自检
                </Button>
              )}

              {/* 阶段2: 自检中 - 显示自检进度 */}
              {flowPhase === 'self-check' && (
                <div className="flex items-center gap-2 text-yellow-500">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                  <span>系统自检中，请稍候...</span>
                </div>
              )}

              {/* 阶段3: 就绪 - 显示开始录制按钮 */}
              {flowPhase === 'ready' && (
                <Button size="lg" onClick={handleStartRecording} className="gap-2 bg-green-600 hover:bg-green-700">
                  <Play className="h-5 w-5" />
                  开始生成视觉拓扑航线
                </Button>
              )}

              {/* 阶段4: 录制中 */}
              {flowPhase === 'recording' && (
                <>
                  <Button size="lg" variant="outline" onClick={handlePauseRecording} className="gap-2">
                    <Pause className="h-5 w-5" />
                    暂停
                  </Button>
                  <Button size="lg" variant="destructive" onClick={handleStopRecording} className="gap-2">
                    <Square className="h-5 w-5" />
                    停止
                  </Button>
                </>
              )}

              {/* 阶段5: 暂停 */}
              {flowPhase === 'paused' && (
                <>
                  <Button size="lg" onClick={handleResumeRecording} className="gap-2">
                    <Play className="h-5 w-5" />
                    继续
                  </Button>
                  <Button size="lg" variant="destructive" onClick={handleStopRecording} className="gap-2">
                    <Square className="h-5 w-5" />
                    停止
                  </Button>
                </>
              )}

              {/* 阶段6: 完成 */}
              {flowPhase === 'completed' && (
                <>
                  <Button size="lg" variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="h-5 w-5" />
                    重新录制
                  </Button>
                  <Button size="lg" onClick={handleSave} disabled={!routeName || !selectedScene} className="gap-2">
                    <Save className="h-5 w-5" />
                    保存航线
                  </Button>
                </>
              )}
            </div>

            {/* 提示信息 */}
            <div className="text-center text-sm text-muted-foreground">
              {flowPhase === 'idle' && '点击按钮连接无人机'}
              {flowPhase === 'self-check' && '正在检查无人机各系统状态...'}
              {flowPhase === 'ready' && '自检通过！点击开始录制航线'}
              {flowPhase === 'recording' && '正在录制飞行轨迹，请操控无人机按预定路线飞行'}
              {flowPhase === 'paused' && '录制已暂停，可以继续或停止'}
              {flowPhase === 'completed' && '录制完成，可以保存或重新录制'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}