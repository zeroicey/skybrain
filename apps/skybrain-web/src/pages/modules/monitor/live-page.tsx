import { useState, useEffect } from 'react'
import { Maximize2 } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { VideoPlayer } from '@/components/monitor/video-player'
import { VideoControls } from '@/components/monitor/video-controls'
import { DroneInfoPanel } from '@/components/monitor/drone-info-panel'
import { mockDrones } from '@/data/mock-drones'
import { Button } from '@/components/ui/button'
import type { VideoQuality } from '@/types/drone'

const qualities: VideoQuality[] = ['流畅', '高清', '4K']

export default function LivePage() {
  const [searchParams] = useSearchParams()
  const selectedDroneId = searchParams.get('drone') || ''
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [quality, setQuality] = useState<string>('流畅')

  const selectedDrone = mockDrones.find(d => d.id === selectedDroneId)

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
            isLoading={!!selectedDrone && selectedDrone.status !== 'offline'}
            isOffline={selectedDrone?.status === 'offline'}
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