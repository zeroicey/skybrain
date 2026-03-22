import { useState, useMemo, useEffect } from 'react'
import { FileOutput } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { VideoPlayer } from '@/components/monitor/video-player'
import { VideoTimeline } from '@/components/monitor/video-timeline'
import { RecordTable } from '@/components/monitor/record-table'
import { mockVideoRecords } from '@/data/mock-video-records'
import { Button } from '@/components/ui/button'
import type { VideoRecord } from '@/types/drone'

export default function PlaybackPage() {
  const [searchParams] = useSearchParams()
  const selectedDroneId = searchParams.get('drone') || 'all'
  const selectedDate = searchParams.get('date') || ''
  const searchQuery = searchParams.get('search') || ''

  const [currentRecord, setCurrentRecord] = useState<VideoRecord | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 筛选录像
  const filteredRecords = useMemo(() => {
    return mockVideoRecords.filter(record => {
      // 无人机筛选
      if (selectedDroneId !== 'all' && record.droneId !== selectedDroneId) {
        return false
      }
      // 日期筛选
      if (selectedDate && !record.startTime.startsWith(selectedDate)) {
        return false
      }
      // 搜索筛选
      if (searchQuery && !record.droneName.includes(searchQuery)) {
        return false
      }
      return true
    })
  }, [selectedDroneId, selectedDate, searchQuery])

  // 分页
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, currentPage])

  const totalPages = Math.ceil(filteredRecords.length / pageSize)

  const handlePlay = (record: VideoRecord) => {
    setCurrentRecord(record)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleDownload = (record: VideoRecord) => {
    console.log('下载录像:', record.id)
  }

  const handleExport = () => {
    console.log('批量导出')
  }

  const handleSeek = (time: number) => {
    setCurrentTime(time)
  }

  // 筛选条件变化时重置页码
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedDroneId, selectedDate, searchQuery])

  return (
    <div className="flex flex-col h-full">
      {/* 内容区域 */}
      <div className="flex-1 p-6 overflow-auto h-full no-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 播放器区域 */}
          {currentRecord ? (
            <div className="space-y-4">
              <VideoPlayer isLoading={isPlaying} />
              <VideoTimeline
                records={[currentRecord]}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
              <div className="text-sm text-muted-foreground">
                正在播放: {currentRecord.droneName} - {currentRecord.startTime}
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">选择录像进行播放</p>
            </div>
          )}

          {/* 录像列表 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">录像列表</h3>
              <Button variant="outline" onClick={handleExport}>
                <FileOutput className="h-4 w-4 mr-2" />
                批量导出
              </Button>
            </div>
            <RecordTable
              records={paginatedRecords}
              onPlay={handlePlay}
              onDownload={handleDownload}
            />

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}