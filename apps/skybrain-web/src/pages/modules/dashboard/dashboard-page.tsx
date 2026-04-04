import { useEffect } from 'react'
import { useVideoChannels, getStreamUrl } from '@/hooks/useVideoChannels'
import { useDashboardStore } from '@/stores/dashboard-store'
import { DroneStatusCard } from '@/components/dashboard/drone-status-card'
import { TaskOverviewCard } from '@/components/dashboard/task-overview-card'
import { BatteryStatusCard } from '@/components/dashboard/battery-status-card'
import { AlertList } from '@/components/dashboard/alert-list'
import { FlightStatsCard } from '@/components/dashboard/flight-stats-card'
import { VideoGrid } from '@/components/dashboard/video-grid'
import { DroneListCard } from '@/components/dashboard/drone-list-card'
import { TaskStatsCard } from '@/components/dashboard/task-stats-card'
import { EquipmentHealthCard } from '@/components/dashboard/equipment-health-card'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'

import { mockDrones } from '@/data/mock-drones'
import { mockTasks, mockTaskLogs } from '@/data/mock-tasks'
import { mockDeviceBatteries } from '@/data/mock-device-batteries'

export default function DashboardPage() {
  const { loading: channelsLoading, channels } = useVideoChannels()
  const { droneVideoMap, setDroneVideoMap } = useDashboardStore()

  // 过滤在线无人机
  const onlineDronesList = mockDrones.filter(d => d.status !== 'offline')

  // 分配视频流给无人机
  useEffect(() => {
    if (channelsLoading || channels.length === 0) return

    // 如果已经有视频流了，就不重新分配
    if (droneVideoMap.size > 0) return

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelsLoading, channels.length]) // Only run when channels load

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
    <div className="container mx-auto p-6 space-y-6 no-scrollbar overflow-auto h-full">
      {/* 第一行：4个状态卡片 - 使用 auto-fit 让卡片自适应内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DroneStatusCard drones={mockDrones} />
        <TaskOverviewCard tasks={mockTasks} />
        <BatteryStatusCard batteries={mockDeviceBatteries} />
        <AlertList logs={mockTaskLogs} />
      </div>

      {/* 第二行：飞行统计(宽) + 任务统计 + 设备健康 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FlightStatsCard
            todayFlightMinutes={todayFlightMinutes}
            todayTasks={todayTasks}
            todayDistance={todayDistance}
            successRate={successRate}
          />
        </div>
        <TaskStatsCard tasks={mockTasks} />
      </div>

      {/* 设备健康单独一行 */}
      <EquipmentHealthCard batteries={mockDeviceBatteries} />

      {/* 第三行：无人机列表 + 活动 timeline + 视频Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 no-scrollbar overflow-auto" style={{ maxHeight: '400px' }}>
          <DroneListCard drones={mockDrones} />
        </div>
        <div className="lg:col-span-1 no-scrollbar overflow-auto" style={{ maxHeight: '400px' }}>
          <ActivityTimeline logs={mockTaskLogs} />
        </div>
        <div className="lg:col-span-2">
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
    </div>
  )
}