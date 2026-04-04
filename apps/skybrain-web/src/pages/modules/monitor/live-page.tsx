import { useState, useEffect } from 'react'
import { Maximize2 } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { VideoPlayer } from '@/components/monitor/video-player'
import { VideoControls } from '@/components/monitor/video-controls'
import { DroneInfoPanel } from '@/components/monitor/drone-info-panel'
import { mockDrones } from '@/data/mock-drones'
import { Button } from '@/components/ui/button'
import type { VideoQuality } from '@/types/drone'
import { useVideoChannels, getStreamUrl } from '@/hooks/useVideoChannels'

const qualities: VideoQuality[] = ['流畅', '高清', '4K']

export default function LivePage() {
  const [searchParams] = useSearchParams()
  const selectedDroneId = searchParams.get('drone') || ''
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [quality, setQuality] = useState<string>('流畅')

  // 直接使用 mockDrones
  const selectedDrone = mockDrones.find(d => d.id === selectedDroneId)

  // 获取视频频道
  const { loading: channelsLoading, channels } = useVideoChannels()

  // 根据无人机索引获取对应的视频流
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [isMjpg, setIsMjpg] = useState(false)

  // 当 channels 加载完成后，设置对应的视频流
  useEffect(() => {
    if (!selectedDrone) {
      setStreamUrl(null)
      setIsMjpg(false)
      return
    }

    // 如果是真实无人机（MJPEG 流），直接使用无人机的 streamUrl
    if (selectedDrone.isMjpg && selectedDrone.streamUrl) {
      setStreamUrl(selectedDrone.streamUrl)
      setIsMjpg(true)
      return
    }

    if (channelsLoading || channels.length === 0) {
      return
    }

    setIsMjpg(false)

    // 获取所有在线无人机
    const onlineDrones = mockDrones.filter(d => d.status !== 'offline')
    const droneIndex = onlineDrones.findIndex(d => d.id === selectedDroneId)

    // 直接使用 channels 数组中对应索引的 channel
    if (droneIndex >= 0 && channels[droneIndex]) {
      setStreamUrl(getStreamUrl(channels[droneIndex].id, channels))
    } else if (channels.length > 0) {
      setStreamUrl(getStreamUrl(channels[0].id, channels))
    }
  }, [selectedDroneId, channelsLoading, channels, selectedDrone])

  // 模拟播放时间递增
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime(t => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const handleSkipForward = () => {
    setCurrentTime(currentTime + 10)
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    setIsMuted(value === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    console.log('进入全屏')
  }

  const handleSnapshot = () => {
    console.log('截图')
  }

  const handleRecord = () => {
    console.log('录像')
  }

  return (
    <div className="flex flex-col h-full">
      {/* 视频区域 */}
      <div className="flex-1 p-6 overflow-auto h-full no-scrollbar">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            streamUrl={streamUrl}
            isLoading={channelsLoading || !streamUrl}
            isOffline={selectedDrone?.status === 'offline'}
            isMjpg={isMjpg}
          />

          <div className="mt-4">
            <VideoControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={3600}
              volume={volume}
              isMuted={isMuted}
              onPlayPause={handlePlayPause}
              onSkipBack={handleSkipBack}
              onSkipForward={handleSkipForward}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={handleMuteToggle}
              onFullscreen={handleFullscreen}
              onSnapshot={handleSnapshot}
              onRecord={handleRecord}
            />
          </div>

          {/* 底部：画质切换 + 全屏 */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 border rounded-md p-1">
              {qualities.map((q) => (
                <Button
                  key={q}
                  variant={quality === q ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setQuality(q)}
                  className="text-xs h-6 px-2"
                >
                  {q}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={handleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4">
            <DroneInfoPanel
              drone={selectedDrone}
              speed={12}
              location="教学区A"
            />
          </div>
        </div>
      </div>
    </div>
  )
}