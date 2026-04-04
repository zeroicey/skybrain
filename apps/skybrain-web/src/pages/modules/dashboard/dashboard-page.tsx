import { useEffect, useState } from 'react'
import { ScanEye, RefreshCw } from 'lucide-react'
import { DroneStatusCard } from '@/components/dashboard/drone-status-card'
import { TaskOverviewCard } from '@/components/dashboard/task-overview-card'
import { BatteryStatusCard } from '@/components/dashboard/battery-status-card'
import { AlertList } from '@/components/dashboard/alert-list'
import { FlightStatsCard } from '@/components/dashboard/flight-stats-card'
import { VideoGrid } from '@/components/dashboard/video-grid'

import { mockDrones } from '@/data/mock-drones'
import { mockTasks, mockTaskLogs } from '@/data/mock-tasks'
import { mockDeviceBatteries } from '@/data/mock-device-batteries'

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 计算统计数据
  const onlineDrones = mockDrones.filter(d => d.status === 'online').length
  const successRate = mockTasks.length > 0
    ? Math.round(((mockTasks.length - mockTasks.filter(t => t.status === 'failed' || t.status === 'cancelled').length) / mockTasks.length) * 100)
    : 100

  // 模拟飞行数据
  const todayFlightMinutes = 4 * 60 + 32 // 4h 32m
  const todayTasks = mockTasks.filter(t => t.status === 'completed' || t.status === 'running').length
  const todayDistance = 28.5

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScanEye className="h-8 w-8 text-sky-500" />
          <div>
            <h1 className="text-2xl font-bold">SkyBrain 终端</h1>
            <p className="text-sm text-zinc-400">智能无人机管理系统</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-zinc-400">
              {currentTime.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-lg font-mono">
              {currentTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <RefreshCw className="h-5 w-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 状态卡片行 */}
      <div className="grid grid-cols-4 gap-4">
        <DroneStatusCard drones={mockDrones} />
        <TaskOverviewCard tasks={mockTasks} />
        <BatteryStatusCard batteries={mockDeviceBatteries} />
        <AlertList logs={mockTaskLogs} />
      </div>

      {/* 飞行统计 */}
      <FlightStatsCard
        todayFlightMinutes={todayFlightMinutes}
        todayTasks={todayTasks}
        todayDistance={todayDistance}
        successRate={successRate}
      />

      {/* 实时监控视频Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          实时监控
          <span className="text-sm font-normal text-zinc-400">
            ({onlineDrones} 架在线)
          </span>
        </h2>
        <VideoGrid drones={mockDrones} />
      </div>
    </div>
  )
}