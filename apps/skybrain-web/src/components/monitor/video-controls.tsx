import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Camera,
  Circle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface VideoControlsProps {
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  volume?: number
  isMuted?: boolean
  onPlayPause?: () => void
  onSkipBack?: () => void
  onSkipForward?: () => void
  onVolumeChange?: (volume: number) => void
  onMuteToggle?: () => void
  onFullscreen?: () => void
  onSnapshot?: () => void
  onRecord?: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function VideoControls({
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 80,
  isMuted = false,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
  onSnapshot,
  onRecord,
}: VideoControlsProps) {
  const [localVolume, setLocalVolume] = useState(volume)
  const [isRecording, setIsRecording] = useState(false)

  const handleVolumeChange = (value: number[]) => {
    setLocalVolume(value[0])
    onVolumeChange?.(value[0])
  }

  const handleRecordToggle = () => {
    setIsRecording(!isRecording)
    onRecord?.()
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
      {/* 进度条 */}
      <Slider
        defaultValue={[currentTime]}
        max={duration || 100}
        step={1}
        className="cursor-pointer"
      />

      {/* 控制按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* 跳过后退 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkipBack}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* 播放/暂停 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          {/* 跳过前进 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkipForward}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* 时间显示 */}
          <span className="text-sm text-muted-foreground ml-2 min-w-[100px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 截图 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSnapshot}
            className="h-8 w-8"
            title="截图"
          >
            <Camera className="h-4 w-4" />
          </Button>

          {/* 录像 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRecordToggle}
            className={cn(
              'h-8 w-8',
              isRecording && 'text-red-500'
            )}
            title={isRecording ? '停止录像' : '开始录像'}
          >
            <Circle className={cn('h-4 w-4', isRecording && 'fill-current')} />
          </Button>

          {/* 音量 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMuteToggle}
            className="h-8 w-8"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Slider
            value={[isMuted ? 0 : localVolume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-20 cursor-pointer"
          />

          {/* 全屏 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onFullscreen}
            className="h-8 w-8"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}