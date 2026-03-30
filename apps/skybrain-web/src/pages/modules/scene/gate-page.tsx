import { useEffect, useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Users, AlertTriangle, Clock, DoorOpen, Camera, Wifi, Activity, ArrowRight, ArrowLeft } from 'lucide-react'
import { useGateStore } from '@/stores/gate-store'
import { generateIdentityDistribution, gateCameras } from '@/data/mock-gates'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useVideoChannels, getFullUrl } from '@/hooks/useVideoChannels'
import { VideoPlayer } from '@/components/monitor/video-player'

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
}

const congestionColors = {
  light: 'bg-green-500',
  medium: 'bg-yellow-500',
  heavy: 'bg-red-500',
}

const congestionLabels = {
  light: '畅通',
  medium: '拥挤',
  heavy: '爆满',
}

export default function GatePage() {
  const {
    selectedGateId,
    realtimeIn,
    realtimeOut,
    statCardData,
    hourlyTrend,
    areaHeatmap,
    forecastData,
    congestionIndex,
    updateRealtimeData,
    refreshAllData,
  } = useGateStore()

  const [selectedCamera, setSelectedCamera] = useState(gateCameras[0].id)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)

  // 视频流
  const { getRandomChannel, loading: videoLoading } = useVideoChannels()
  const [streamUrl, setStreamUrl] = useState<string | null>(null)

  // 初始化时随机获取视频
  useEffect(() => {
    if (!videoLoading) {
      const channel = getRandomChannel('gate')
      if (channel) {
        setStreamUrl(getFullUrl(channel.url))
      }
    }
  }, [videoLoading])

  useEffect(() => { refreshAllData() }, [])
  useEffect(() => {
    const interval = setInterval(() => { updateRealtimeData() }, 3000)
    return () => clearInterval(interval)
  }, [updateRealtimeData])

  const camerasFiltered = useMemo(() => gateCameras.filter((c) => c.gateId === selectedGateId), [selectedGateId])
  const pieData = useMemo(() => generateIdentityDistribution(), [])

  useEffect(() => {
    const timer = setTimeout(() => { refreshAllData() }, 100)
    return () => clearTimeout(timer)
  }, [selectedGateId])

  const totalRealtime = realtimeIn + realtimeOut

  return (
    <div className="h-full overflow-auto p-3 no-scrollbar">
      <div className="flex gap-3">
        <div className="w-[280px] flex-shrink-0 flex flex-col justify-around overflow-hidden">
          <div className="min-h-[90px]">
            <h3 className="text-xs font-medium mb-1 text-muted-foreground">拥堵指数</h3>
            <div className="h-[calc(100%-20px)] flex items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#334155" strokeWidth="8" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke={congestionIndex < 40 ? COLORS.success : congestionIndex < 70 ? COLORS.warning : COLORS.danger} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(congestionIndex / 100) * 214} 214}`} className="transition-all duration-300" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{congestionIndex}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="min-h-[70px]">
            <h3 className="text-xs font-medium mb-1 text-muted-foreground">今日累计</h3>
            <div className="h-[calc(100%-20px)] flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <span className="text-xl font-bold">{statCardData.todayTotal.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground ml-1">人次</span>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="min-h-[100px]">
            <h3 className="text-xs font-medium mb-1 text-muted-foreground">时段人数</h3>
            <div className="h-[calc(100%-20px)]">
              <div className="space-y-2">
                {areaHeatmap.slice(0, 6).map((area) => (
                  <div key={area.id} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 truncate">{area.name}</span>
                    <div className="flex-1 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${area.density}%`, backgroundColor: area.density > 70 ? COLORS.danger : area.density > 40 ? COLORS.warning : COLORS.success }} />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{area.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="min-h-[180px] flex flex-col">
            <h3 className="text-xs font-medium mb-1 text-muted-foreground">身份分布</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={2} dataKey="value">
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">实时视频监控</h3>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-muted-foreground" />
              <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)} className="bg-background text-foreground text-xs px-2 py-1 rounded border border-input">
                {camerasFiltered.map((cam) => (<option key={cam.id} value={cam.id}>{cam.name}</option>))}
              </select>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 text-[10px]">
                <Wifi className="w-3 h-3" />在线
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{new Date().toLocaleTimeString('zh-CN')}</span>
              <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setIsVideoPlaying(!isVideoPlaying)}>
                {isVideoPlaying ? <span className="w-2 h-2 bg-foreground rounded-sm" /> : <span className="w-0 h-0 border-l-[5px] border-l-foreground border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent" />}
              </Button>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
            {streamUrl ? (
              <VideoPlayer streamUrl={streamUrl} isLoading={videoLoading} />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">等待视频信号...</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/70 rounded px-2 py-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white font-mono text-lg">{totalRealtime}</span>
              <span className="text-slate-400 text-xs">人</span>
            </div>
          </div>

          <div className="flex gap-3 min-h-[180px]">
            <div className="flex-1">
              <h3 className="text-xs font-medium mb-1 text-muted-foreground">24小时通行趋势</h3>
              <div className="h-[calc(100%-20px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyTrend.filter((_, i) => i % 4 === 0)} margin={{ left: -15, right: 0, top: 5, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} tickFormatter={(v) => v.split(':')[0] + '时'} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', fontSize: '11px' }} labelStyle={{ color: '#94a3b8' }} />
                    <Area type="monotone" dataKey="count" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Separator orientation="vertical" />

            <div className="flex-1">
              <h3 className="text-xs font-medium mb-1 text-muted-foreground">未来2小时预测</h3>
              <div className="h-[calc(100%-20px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData || []} margin={{ left: -15, right: 0, top: 5, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="predicted" stroke={COLORS.secondary} strokeWidth={2} dot={{ fill: COLORS.secondary, r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[240px] flex-shrink-0 flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
              <DoorOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">实时进出</div>
              <div className="flex items-baseline gap-1">
                <ArrowLeft className="w-3 h-3 text-green-500" />
                <span className="text-lg font-bold">{realtimeIn}</span>
                <ArrowRight className="w-3 h-3 text-red-500 ml-1" />
                <span className="text-lg font-bold">{realtimeOut}</span>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="flex-1 flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${statCardData.congestionLevel === 'light' ? 'bg-green-500/10' : statCardData.congestionLevel === 'medium' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
              <AlertTriangle className={`w-5 h-5 ${statCardData.congestionLevel === 'light' ? 'text-green-500' : statCardData.congestionLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'}`} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">拥堵等级</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{congestionLabels[statCardData.congestionLevel]}</span>
                <Badge className={`${congestionColors[statCardData.congestionLevel]} text-white border-none text-xs`}>{congestionIndex}%</Badge>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="flex-1">
            <h3 className="text-xs font-medium mb-1 text-muted-foreground">高峰时段</h3>
            <div className="h-[calc(100%-20px)] flex items-center justify-center">
              <div className="text-center">
                <Clock className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <span className="text-xl font-bold">{statCardData.peakTime}</span>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="flex-1">
            <h3 className="text-xs font-medium mb-1 text-muted-foreground">异常通行</h3>
            <div className="h-[calc(100%-20px)] flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <span className="text-xl font-bold">{statCardData.anomalyCount}</span>
                <span className="text-sm text-muted-foreground ml-1">次</span>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="flex-1">
            <h3 className="text-xs font-medium mb-1 text-muted-foreground">通行状态</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">畅通 (&lt;40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">拥挤 (40-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">爆满 (&gt;70%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
