import { useEffect, useState } from 'react'
import { DroneStatusCard } from '@/components/dashboard/drone-status-card'
import { TaskOverviewCard } from '@/components/dashboard/task-overview-card'
import { BatteryStatusCard } from '@/components/dashboard/battery-status-card'
import { AlertList } from '@/components/dashboard/alert-list'
import { FlightStatsCard } from '@/components/dashboard/flight-stats-card'
import { VideoGrid } from '@/components/dashboard/video-grid'

import { mockDrones } from '@/data/mock-drones'
import { mockTasks, mockTaskLogs } from '@/data/mock-tasks'
import { mockDeviceBatteries } from '@/data/mock-device-batteries'
import { useVideoChannels, getStreamUrl } from '@/hooks/useVideoChannels'

export default function DashboardPage() {
  const { loading: channelsLoading, channels } = useVideoChannels()
  const [droneVideoMap, setDroneVideoMap] = useState<Map<string, string>>(new Map())

  // 过滤在线无人机
  const onlineDronesList = mockDrones.filter(d => d.status !== 'offline')

  // 分配视频流给无人机
  useEffect(() => {
    if (channelsLoading || channels.length === 0) return

    const newMap = new Map<string, string>()

    // 随机打乱 channels 并分配给在线无人机
    const shuffledChannels = [...channels].sort(() => Math.random() - 0.5)

    onlineDronesList.forEach((drone, index) => {
      // 如果是真实无人机（MJPEG 流），直接使用无人机的 streamUrl
      if (drone.isMjpg && drone.streamUrl) {
        newMap.set(drone.id, drone.streamUrl)
      } else if (shuffledChannels[index]) {
        newMap.set(drone.id, getStreamUrl(shuffledChannels[index].id, channels))
      }
    })

    setDroneVideoMap(newMap)
  }, [channelsLoading, channels, onlineDronesList])

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
        <VideoGrid
          drones={onlineDronesList}
          videoMap={droneVideoMap}
          isLoading={channelsLoading}
        />
      </div>
    </div>
  )
}